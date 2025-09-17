// src/app/api/get-responses-by-email/[email]/route.js (更新版本)
/**
 * @swagger
 * /api/get-responses-by-email/{email}:
 *   get:
 *     summary: 根據電子郵件搜尋回應
 *     description: 根據電子郵件地址從 Typeform API 搜尋相關回應
 *     tags: [Typeform Responses]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: 電子郵件地址
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: 成功找到相關回應
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Response'
 *       400:
 *         description: 缺少電子郵件參數
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 未授權
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   options:
 *     summary: CORS 預檢請求
 *     description: 處理 CORS 預檢請求
 *     tags: [CORS]
 *     responses:
 *       200:
 *         description: CORS 預檢請求成功
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request, { params }) {
  const email = params.email;

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const TYPEFORM_TOKEN = process.env.TYPEFORM_TOKEN;
  const FORM_ID = process.env.FORM_ID;

  const url = new URL(`https://api.typeform.com/forms/${FORM_ID}/responses`);
  url.searchParams.append('query', email);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TYPEFORM_TOKEN}`,
    },
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.ok ? 200 : res.status,
    headers: corsHeaders,
  });
} 