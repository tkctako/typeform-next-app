import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const client = await clientPromise;
    const db = client.db('users');
    const collection = db.collection('default');
    console.log('輸入的 email:', email);
    // 查找用戶
    const user = await collection.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { message: '找不到此用戶' },
        { status: 401 }
      );
    }
    console.log('查到的 user:', user);
    console.log('輸入的 password:', password);
    console.log('資料庫的 password:', user.password);
    // 驗證密碼
    const isValid = await bcrypt.compare(password, user.password);
    console.log(isValid);
    if (!isValid) {
      return NextResponse.json(
        { message: '密碼錯誤' },
        { status: 401 }
      );
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 設置 cookie
    const response = NextResponse.json(
      { message: '登入成功' },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 小時
    });

    return response;

  } catch (error) {
    console.error('登入錯誤:', error);
    return NextResponse.json(
      { message: '系統錯誤' },
      { status: 500 }
    );
  }
}