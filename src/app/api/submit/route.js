import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request) {
  const body = await request.json()
  const client = await clientPromise
  const db = client.db('your-db-name')
  const collection = db.collection('submissions')

  await collection.insertOne({
    ...body,
    createdAt: new Date(),
  })

  return NextResponse.json({ message: '儲存成功' })
}
