'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  // 第一層頁籤
  const [mainTab, setMainTab] = useState('responses');
  // 第二層頁籤（僅在設定權重時顯示）
  const [weightTab, setWeightTab] = useState('question');

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">沛愛問卷後台</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-gray-600">
                {user.email}，您好！
              </span>
            )}
            {user && (
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                登出
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}