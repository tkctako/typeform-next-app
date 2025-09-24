import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Recommend from '@/models/Recommend';

/**
 * @swagger
 * components:
 *   schemas:
 *     RecommendData:
 *       type: object
 *       properties:
 *         item:
 *           type: string
 *           description: 九大項英文代碼
 *           enum: [digestive, joint, urinary, skin, emotion, weight, cardiovascular, eye, immune]
 *         scores:
 *           type: object
 *           description: 各分數等級的推薦資料
 *           additionalProperties:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *               note:
 *                   type: string
 *               productInput:
 *                   type: string
 *               description:
 *                   type: string
 *               ingredients:
 *                   type: string
 *               formula:
 *                   type: string
 *     RecommendResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         recommend:
 *           $ref: '#/components/schemas/RecommendData'
 *         recommends:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecommendData'
 */

/**
 * @swagger
 * /api/recommend:
 *   post:
 *     summary: 儲存推薦商品資料
 *     description: 儲存或更新特定九大項的推薦商品配置
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendData'
 *     responses:
 *       200:
 *         description: 成功儲存推薦資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendResponse'
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: 取得推薦商品資料
 *     description: 取得推薦商品配置，可指定特定九大項或取得全部
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: item
 *         required: false
 *         description: 九大項英文代碼，不提供則取得全部
 *         schema:
 *           type: string
 *           enum: [digestive, joint, urinary, skin, emotion, weight, cardiovascular, eye, immune]
 *     responses:
 *       200:
 *         description: 成功取得推薦資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendResponse'
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const body = await request.json();
    console.log('接收到的資料:', JSON.stringify(body, null, 2));
    
    // 確保 scores 資料格式正確
    const scoresData = {};
    for (const [score, data] of Object.entries(body.scores)) {
      scoresData[score] = {
        products: data.products || [],
        note: data.note || '',
        productInput: data.productInput || '',
        description: data.description || '',
        ingredients: data.ingredients || '',
        formula: data.formula || ''
      };
    }
    
    console.log('處理後的 scores 資料:', JSON.stringify(scoresData, null, 2));
    
    // 使用 findOneAndUpdate 直接更新
    const recommend = await Recommend.findOneAndUpdate(
      { item: body.item },
      { 
        $set: { 
          scores: scoresData, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true, new: true }
    );

    console.log('儲存後的資料:', JSON.stringify(recommend, null, 2));

    return NextResponse.json({ success: true, recommend });
  } catch (error) {
    console.error('儲存推薦資料錯誤:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 支援 /api/recommend?item=xxx
export async function GET(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { searchParams } = new URL(request.url);
    const item = searchParams.get('item');

    if (item) {
      // 查詢單一九大項
      const recommend = await Recommend.findOne({ item });
      if (recommend) {
        console.log('從資料庫讀取的資料:', JSON.stringify(recommend, null, 2));
        return NextResponse.json({ success: true, recommend });
      } else {
        return NextResponse.json({ success: true, recommend: null });
      }
    } else {
      // 查詢全部
      const recommends = await Recommend.find({});
      return NextResponse.json({ success: true, recommends });
    }
  } catch (error) {
    console.error('取得推薦資料錯誤:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
