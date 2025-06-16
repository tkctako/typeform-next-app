import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('token');

  // 不需要驗證的路徑
  const publicPaths = ['/login', '/api/auth/login'];
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // 驗證 token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    // 排除 /api/test、/api/get-response、/api/get-responses-by-email、/api/get-responses-by-session 開頭的路徑
    '/((?!api/test|api/get-response(?:/.*)?|api/get-responses-by-email(?:/.*)?|api/get-responses-by-session(?:/.*)?|_next/static|_next/image|favicon.ico).*)',
  ],
};