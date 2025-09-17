import { NextResponse } from 'next/server';
import { cyberbizFetch } from '@/lib/cyberbiz';

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: 取得特定客戶資料
 *     description: 根據客戶ID從 Cyberbiz API 取得特定客戶資料
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 客戶ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功取得客戶資料
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   $ref: '#/components/schemas/Customer'
 *       404:
 *         description: 找不到客戶
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
export async function GET(request, { params }) {
  const { id } = params; // 取得路徑參數
  try {
    // Cyberbiz 單一 customer API 路徑（請依實際 API 文件調整）
    const data = await cyberbizFetch(`/v1/customers/${id}`, 'GET');
    return NextResponse.json({ customer: data });
  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
