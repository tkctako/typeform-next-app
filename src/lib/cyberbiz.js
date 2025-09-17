import crypto from 'crypto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

/**
 * 發送 Cyberbiz API 請求 (使用 Bearer Token 認證)
 * @param {string} path - 例如 /v1/products
 * @param {string} method - 'GET' | 'POST' ...
 * @param {object} [options] - fetch 的其他 options（如 body）
 * @returns {Promise<object>} - Cyberbiz API 回傳的 JSON
 */
export async function cyberbizFetch(path, method = 'GET', options = {}) {
  const apiToken = process.env.CYBERBIZ_API_TOKEN;
  
  console.log('API Token:', apiToken ? '已設定' : '未設定');
  
  const host = 'https://app-store-api.cyberbiz.io';
  const url = `${host}${path}`;

  const fetchOptions = {
    method,
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  console.log('Request URL:', url);
  console.log('Request Headers:', fetchOptions.headers);

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cyberbiz API 失敗: ${res.status} ${text}`);
  }

  return res.json();
}
