import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

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
