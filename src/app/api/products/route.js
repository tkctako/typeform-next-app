import { NextResponse } from 'next/server';
import { cyberbizFetch } from '@/lib/cyberbiz';

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: 取得產品列表
 *     description: 從 Cyberbiz API 取得所有產品資料
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: 成功取得產品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  try {
    const data = await cyberbizFetch('/v1/products', 'GET');
    return NextResponse.json({ products: data });
  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
