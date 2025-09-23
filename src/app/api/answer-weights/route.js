import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import AnswerWeight from '@/models/AnswerWeight';

/**
 * @swagger
 * components:
 *   schemas:
 *     AnswerWeightData:
 *       type: object
 *       properties:
 *         questionId:
 *           type: string
 *           description: Typeform 問題 ID
 *         questionTitle:
 *           type: string
 *           description: 問題標題
 *         answerWeights:
 *           type: object
 *           description: 答案權重資料
 *           additionalProperties:
 *             type: object
 *             additionalProperties:
 *               type: number
 *     AnswerWeightResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         answerWeight:
 *           $ref: '#/components/schemas/AnswerWeightData'
 *         answerWeights:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AnswerWeightData'
 */

/**
 * @swagger
 * /api/answer-weights:
 *   post:
 *     summary: 儲存分數權重資料
 *     description: 儲存或更新特定問題的分數權重配置
 *     tags: [Answer Weights]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnswerWeightData'
 *     responses:
 *       200:
 *         description: 成功儲存分數權重資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnswerWeightResponse'
 *       500:
 *         description: 伺服器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: 取得分數權重資料
 *     description: 取得分數權重配置，可指定特定問題或取得全部
 *     tags: [Answer Weights]
 *     parameters:
 *       - in: query
 *         name: questionId
 *         required: false
 *         description: Typeform 問題 ID，不提供則取得全部
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功取得分數權重資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnswerWeightResponse'
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
    
    // 用 questionId 當唯一 key，重複就覆蓋
    const answerWeight = await AnswerWeight.findOneAndUpdate(
      { questionId: body.questionId },
      { 
        $set: { 
          questionTitle: body.questionTitle,
          answerWeights: body.answerWeights,
          updatedAt: new Date() 
        } 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, answerWeight });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 支援 /api/answer-weights?questionId=xxx
export async function GET(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    if (questionId) {
      // 查詢單一問題
      const answerWeight = await AnswerWeight.findOne({ questionId });
      return NextResponse.json({ success: true, answerWeight });
    } else {
      // 查詢全部
      const answerWeights = await AnswerWeight.find({});
      return NextResponse.json({ success: true, answerWeights });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
