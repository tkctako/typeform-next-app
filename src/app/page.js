'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import TypeformResponses from '@/components/TypeformResponses';
import ScoreSettings from '@/components/ScoreSettings';
import ProductRecommendations from '@/components/ProductRecommendations';
import PetIntroductions from '@/components/PetIntroductions';
import ApiTester from '@/components/ApiTester';
import { useEffect, useState } from 'react';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // 頁籤狀態
  const [mainTab, setMainTab] = useState('responses');

  // Typeform 問題權重暫存資料 - 從 JSON 檔案讀取
  const [answerWeights, setAnswerWeights] = useState({});

  // 測試用的函數
  async function sendMessage() {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '你', message: '哈囉 MongoDB' })
    })
  
    const result = await res.json()
    alert(result.message)
  }
  
  // 取得回覆資料
  const fetchResponse = async () => {
    const res = await fetch('/api/get-response/ugplskupcpikn8xvlougpl1f2vlqonr1');
    const data = await res.json();
    console.log('問卷詳細fetchResponse', data);
  };

  // 取得題目資料
  const fetchQuestions = async () => {
    const res = await fetch('/api/get-questions');
    const data = await res.json();
    console.log('fetchQuestions', data);
    setQuestions(data.fields || []);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      if (result.products) {
        console.log('fetchProducts', result.products);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.log('fetchProducts', err);
    }
  };

  const fetchCustomers = async (customer_id) => {
    try {
      // 根據有沒有 customer_id 決定 API 路徑
      const url = customer_id
        ? `/api/customers/${customer_id}`
        : '/api/customers';

      const response = await fetch(url);
      const result = await response.json();

      if (customer_id) {
        // 查單一 customer
        if (result.customer) {
          console.log('fetchCustomer', result.customer);
        } else {
          throw new Error(result.error);
        }
      } else {
        // 查全部 customers
        if (result.customers) {
          console.log('fetchCustomers', result.customers);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (err) {
      console.log('fetchCustomers', err);
    }
  };

  async function testGetResponseBySession() {
    const sessionId = '06a3a57c-003e-4e2f-a149-3af09069af69';
    const res = await fetch(`/api/get-responses-by-session/${sessionId}`);
    const data = await res.json();
    console.log('session_id 測試結果:', data);
  }

  useEffect(() => {
    fetchQuestions();
    fetchResponse();
    fetchProducts();
    fetchCustomers();
    
    fetchCustomers('34589990');
    testGetResponseBySession();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <main className="min-h-screen bg-gray-100 p-6">
            {/* 頁籤切換 */}
            <div className="flex space-x-8 mb-8 border-b border-gray-300">
              <button
                className={`px-6 py-2 font-bold transition-colors duration-200 border-b-4 ${
                  mainTab === 'responses'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-blue-700'
                }`}
                onClick={() => setMainTab('responses')}
              >
                Typeform回覆資料
              </button>
              <button
                className={`px-6 py-2 font-bold transition-colors duration-200 border-b-4 ${
                  mainTab === 'weight'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-blue-700'
                }`}
                onClick={() => setMainTab('weight')}
              >
                設定分數
              </button>
              <button
                className={`px-6 py-2 font-bold transition-colors duration-200 border-b-4 ${
                  mainTab === 'recommend'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-blue-700'
                }`}
                onClick={() => setMainTab('recommend')}
              >
                推薦商品
              </button>
              <button
                className={`px-6 py-2 font-bold transition-colors duration-200 border-b-4 ${
                  mainTab === 'pet-intro'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-blue-700'
                }`}
                onClick={() => setMainTab('pet-intro')}
              >
                寵物介紹
              </button>
              <ApiTester />
            </div>

            {/* 內容區塊 */}
            {mainTab === 'responses' && (
              <TypeformResponses questions={questions} />
            )}

            {mainTab === 'weight' && (
              <ScoreSettings 
                questions={questions}
                answerWeights={answerWeights}
                setAnswerWeights={setAnswerWeights}
              />
            )}

            {mainTab === 'recommend' && (
              <ProductRecommendations />
            )}

            {mainTab === 'pet-intro' && (
              <PetIntroductions />
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
