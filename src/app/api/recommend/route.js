import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Recommend from '@/models/Recommend';

export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const body = await request.json();
    // 用 item 當唯一 key，重複就覆蓋
    const recommend = await Recommend.findOneAndUpdate(
      { item: body.item },
      { $set: { scores: body.scores, updatedAt: new Date() } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, recommend });
  } catch (error) {
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
      return NextResponse.json({ success: true, recommend });
    } else {
      // 查詢全部
      const recommends = await Recommend.find({});
      return NextResponse.json({ success: true, recommends });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
