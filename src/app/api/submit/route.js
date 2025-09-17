import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

/**
 * @swagger
 * components:
 *   schemas:
 *     SubmitRequest:
 *       type: object
 *       required:
 *         - userId
 *         - responseId
 *         - answers
 *       properties:
 *         userId:
 *           type: string
 *           description: 會員ID
 *         responseId:
 *           type: string
 *           description: 回覆ID
 *         answers:
 *           type: array
 *           description: 回答列表
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *               type:
 *                 type: string
 *                 enum: [text, boolean, choice, choices]
 *               text:
 *                 type: string
 *               boolean:
 *                 type: boolean
 *               choice:
 *                 type: object
 *               choices:
 *                 type: object
 *     SubmitResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: 回應訊息
 */

/**
 * @swagger
 * /api/submit:
 *   post:
 *     summary: 提交問卷回應
 *     description: 將問卷回應資料儲存到資料庫
 *     tags: [Data Submission]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitRequest'
 *     responses:
 *       200:
 *         description: 成功儲存回應資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmitResponse'
 *       400:
 *         description: 請求資料格式錯誤
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
export async function POST(request) {
  const body = await request.json()
  const client = await clientPromise
  const db = client.db('typeform')
  const collection = db.collection('user_responses')

  // 建立答題記錄
  const responseRecord = {
    userId: body.userId, // 會員ID
    responseId: body.responseId, // 回覆ID
    answers: body.answers.map(answer => ({
      questionId: answer.field.id,
      questionTitle: answer.field.title,
      answerType: answer.type,
      answerValue: answer.type === 'text' ? answer.text :
                  answer.type === 'boolean' ? answer.boolean :
                  answer.type === 'choice' ? answer.choice.label :
                  answer.type === 'choices' ? answer.choices.labels :
                  answer[answer.type],
    })),
    createdAt: new Date(),
  }

  await collection.insertOne(responseRecord)

  return NextResponse.json({ message: '答題記錄儲存成功' })
}
