import { NextResponse } from 'next/server';
import { cyberbizFetch } from '@/lib/cyberbiz';

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: 取得客戶列表
 *     description: 從 Cyberbiz API 取得所有客戶資料
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: 成功取得客戶列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  try {
    // Cyberbiz 單一 customer API 路徑（請依實際 API 文件調整）
    const data = await cyberbizFetch('/v1/customers', 'GET');
    return NextResponse.json({ customers: data });
  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
