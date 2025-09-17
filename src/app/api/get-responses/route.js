// src/app/api/get-responses/route.js (更新版本)
/**
 * @swagger
 * /api/get-responses:
 *   get:
 *     summary: 取得 Typeform 回應列表
 *     description: 從 Typeform API 取得表單的所有回應資料
 *     tags: [Typeform Responses]
 *     responses:
 *       200:
 *         description: 成功取得回應列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Response'
 *                 total_items:
 *                   type: number
 *                   description: 總回應數量
 *                 page_count:
 *                   type: number
 *                   description: 總頁數
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

export async function GET() {
  const TYPEFORM_TOKEN = process.env.TYPEFORM_TOKEN;
  const FORM_ID = process.env.FORM_ID;

  const res = await fetch(`https://api.typeform.com/forms/${FORM_ID}/responses`, {
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
