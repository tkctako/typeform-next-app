// src/app/api/get-questions/route.js (更新版本)
/**
 * @swagger
 * /api/get-questions:
 *   get:
 *     summary: 取得表單問題列表
 *     description: 從 Typeform API 取得表單的所有問題和欄位定義
 *     tags: [Typeform Forms]
 *     responses:
 *       200:
 *         description: 成功取得表單問題
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 表單ID
 *                 title:
 *                   type: string
 *                   description: 表單標題
 *                 fields:
 *                   type: array
 *                   description: 表單欄位列表
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       type:
 *                         type: string
 *                       properties:
 *                         type: object
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
 */
export async function GET() {
    const TYPEFORM_TOKEN = process.env.TYPEFORM_TOKEN;
    const FORM_ID = process.env.FORM_ID;
  
    const res = await fetch(`https://api.typeform.com/forms/${FORM_ID}`, {
      headers: {
        Authorization: `Bearer ${TYPEFORM_TOKEN}`,
      },
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      return new Response(JSON.stringify(data), { status: res.status });
    }
  
    return new Response(JSON.stringify(data), { status: 200 });
  }
  