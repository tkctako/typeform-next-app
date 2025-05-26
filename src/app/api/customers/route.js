import { NextResponse } from 'next/server';
import { cyberbizFetch } from '@/lib/cyberbiz';

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
