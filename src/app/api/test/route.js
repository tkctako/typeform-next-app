// src/app/api/test/route.js (更新版本)
/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: API 測試端點
 *     description: 用於測試 API 連線和基本功能
 *     tags: [Testing]
 *     responses:
 *       200:
 *         description: API 正常運作
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Hello from API"
 *   options:
 *     summary: CORS 預檢請求
 *     description: 處理 CORS 預檢請求
 *     tags: [CORS]
 *     responses:
 *       200:
 *         description: CORS 預檢請求成功
 */
export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, message: 'Hello from API' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
