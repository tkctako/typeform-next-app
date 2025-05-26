import { NextResponse } from 'next/server';
import { cyberbizFetch } from '@/lib/cyberbiz';

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
