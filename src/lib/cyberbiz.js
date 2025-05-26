import crypto from 'crypto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

/**
 * 發送 Cyberbiz API 請求
 * @param {string} path - 例如 /v1/products
 * @param {string} method - 'GET' | 'POST' ...
 * @param {object} [options] - fetch 的其他 options（如 body）
 * @returns {Promise<object>} - Cyberbiz API 回傳的 JSON
 */
export async function cyberbizFetch(path, method = 'GET', options = {}) {
  const username = process.env.CYBERBIZ_USERNAME;
  const secret = process.env.CYBERBIZ_SECRET;
  const host = 'https://api.cyberbiz.co';
  const url = `${host}${path}`;

  const xDate = dayjs().utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
  const requestLine = `${method} ${path} HTTP/1.1`;
  const signString = `x-date: ${xDate}\n${requestLine}`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(signString)
    .digest('base64');

  const authorization = `hmac username="${username}", algorithm="hmac-sha256", headers="x-date request-line", signature="${signature}"`;

  const fetchOptions = {
    method,
    headers: {
      'x-date': xDate,
      'Authorization': authorization,
      ...(options.headers || {}),
    },
    ...options,
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cyberbiz API 失敗: ${res.status} ${text}`);
  }

  return res.json();
}
