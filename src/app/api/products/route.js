import { NextResponse } from 'next/server';
import { cyberbizFetch } from '@/lib/cyberbiz';

export async function GET() {
  try {
    const data = await cyberbizFetch('/v1/products', 'GET');
    return NextResponse.json({ products: data });
  } catch (error) {
    console.error('API 錯誤:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
