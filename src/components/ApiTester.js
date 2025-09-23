'use client';

import { useState } from 'react';

export default function ApiTester() {
  const [apiTestResult, setApiTestResult] = useState(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // 測試API函數
  const testScoreAPI = async () => {
    setIsLoadingApi(true);
    setApiTestResult(null);
    
    try {
      const response = await fetch(`/api/get-score/ugplskupcpikn8xvlougpl1f2vlqonr1`);
      const data = await response.json();
      setApiTestResult(data);
      console.log('API測試結果:', data);
    } catch (error) {
      console.error('API測試失敗:', error);
      setApiTestResult({ error: 'API測試失敗', details: error.message });
    } finally {
      setIsLoadingApi(false);
    }
  };

  return (
    <>
      {/* 測試API按鈕 */}
      <button
        className="px-6 py-2 font-bold transition-colors duration-200 border-b-4 border-transparent text-gray-500 hover:text-blue-700 bg-green-100 hover:bg-green-200 rounded-lg"
        onClick={testScoreAPI}
        disabled={isLoadingApi}
      >
        {isLoadingApi ? '測試中...' : '測試API'}
      </button>

      {/* API測試結果顯示 */}
      {apiTestResult && (
        <section className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-green-700">API測試結果</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(apiTestResult, null, 2)}
            </pre>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setApiTestResult(null)}
          >
            關閉結果
          </button>
        </section>
      )}
    </>
  );
}
