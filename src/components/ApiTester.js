'use client';

import { useState } from 'react';

export default function ApiTester() {
  const [apiTestResult, setApiTestResult] = useState(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [testType, setTestType] = useState('score'); // 'score' 或 'result'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 測試 get-score API
  const testScoreAPI = async () => {
    setIsLoadingApi(true);
    setApiTestResult(null);
    setTestType('score');
    setIsModalOpen(true);
    
    try {
      const response = await fetch(`/api/get-score/ugplskupcpikn8xvlougpl1f2vlqonr1`);
      const data = await response.json();
      setApiTestResult(data);
      console.log('get-score API測試結果:', data);
    } catch (error) {
      console.error('get-score API測試失敗:', error);
      setApiTestResult({ error: 'get-score API測試失敗', details: error.message });
    } finally {
      setIsLoadingApi(false);
    }
  };

  // 測試 get-result API
  const testResultAPI = async () => {
    setIsLoadingApi(true);
    setApiTestResult(null);
    setTestType('result');
    setIsModalOpen(true);
    
    try {
      const sessionId = 'ece0b349-b233-43ef-9a25-336671c78122';
      const response = await fetch(`/api/get-result/${sessionId}`);
      const data = await response.json();
      setApiTestResult(data);
      console.log('get-result API測試結果:', data);
    } catch (error) {
      console.error('get-result API測試失敗:', error);
      setApiTestResult({ error: 'get-result API測試失敗', details: error.message });
    } finally {
      setIsLoadingApi(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setApiTestResult(null);
  };

  return (
    <>
      {/* 測試API按鈕組 */}
      <div className="flex space-x-2">
        <button
          className="px-4 py-2 font-bold transition-colors duration-200 border-b-4 border-transparent text-gray-500 hover:text-blue-700 bg-green-100 hover:bg-green-200 rounded-lg"
          onClick={testScoreAPI}
          disabled={isLoadingApi}
        >
          {isLoadingApi && testType === 'score' ? '測試中...' : '測試分數API'}
        </button>
        
        <button
          className="px-4 py-2 font-bold transition-colors duration-200 border-b-4 border-transparent text-gray-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg"
          onClick={testResultAPI}
          disabled={isLoadingApi}
        >
          {isLoadingApi && testType === 'result' ? '測試中...' : '測試結果API'}
        </button>
      </div>

      {/* 浮動視窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* 視窗標題列 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800">
                {testType === 'score' ? 'get-score API' : 'get-result API'} 測試結果
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* 視窗內容 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* 載入中狀態 */}
              {isLoadingApi && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-lg text-gray-600">測試中...</span>
                </div>
              )}

              {/* 測試結果 */}
              {apiTestResult && !isLoadingApi && (
                <div className="space-y-6">
                  {/* 寵物資訊顯示（僅限 get-result API） */}
                  {testType === 'result' && apiTestResult.pet_info && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-blue-800">🐾 寵物資訊</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p><strong>類型:</strong> {apiTestResult.pet_info.type === 'dog' ? '汪星人' : '喵星人'}</p>
                          <p><strong>品種:</strong> {apiTestResult.pet_info.breed}</p>
                        </div>
                        {apiTestResult.pet_info.details && (
                          <div>
                            <p><strong>描述:</strong> {apiTestResult.pet_info.details.description}</p>
                          </div>
                        )}
                      </div>
                      
                      {apiTestResult.pet_info.details && apiTestResult.pet_info.details.healthItems && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">健康項目說明:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(apiTestResult.pet_info.details.healthItems).map(([item, description]) => (
                              <div key={item} className="p-2 bg-white rounded border">
                                <strong>{item}:</strong> {description}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 推薦商品顯示（僅限 get-result API） */}
                  {testType === 'result' && apiTestResult.recommendations && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-purple-800">🛍️ 推薦商品</h3>
                      
                      {/* 0分推薦商品 */}
                      {apiTestResult.recommendations.zeroScoreRecommendations && (
                        <div className="mb-6">
                          <h4 className="text-md font-semibold mb-3 text-purple-700">📋 基礎推薦商品 (0分)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(apiTestResult.recommendations.zeroScoreRecommendations).map(([category, recommendation]) => (
                              <div key={category} className="p-3 bg-white rounded border">
                                <h5 className="font-semibold text-sm mb-2">{category}</h5>
                                {recommendation.data && (
                                  <div className="text-xs">
                                    <p><strong>商品:</strong> {recommendation.data.products?.join(', ') || '無'}</p>
                                    <p><strong>配方:</strong> {recommendation.data.formula || '無'}</p>
                                    {recommendation.data.description && (
                                      <p><strong>說明:</strong> {recommendation.data.description}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 高分推薦商品 */}
                      {apiTestResult.recommendations.highScoreRecommendations && (
                        <div>
                          <h4 className="text-md font-semibold mb-3 text-purple-700">⭐ 重點推薦商品 (高分項目)</h4>
                          <div className="space-y-4">
                            {Object.entries(apiTestResult.recommendations.highScoreRecommendations).map(([category, recommendation]) => (
                              <div key={category} className="p-4 bg-white rounded border">
                                <h5 className="font-semibold text-lg mb-2">
                                  {category} 
                                  <span className="ml-2 text-sm font-normal text-gray-600">
                                    (分數: {recommendation.score}, 對應推薦分數: {recommendation.targetScore})
                                  </span>
                                </h5>
                                
                                {recommendation.data && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p><strong>推薦商品:</strong> {recommendation.data.products?.join(', ') || '無'}</p>
                                      <p><strong>關注等級:</strong> {recommendation.data.note || '無'}</p>
                                    </div>
                                    <div>
                                      <p><strong>對應配方:</strong> {recommendation.data.formula || '無'}</p>
                                    </div>
                                    {recommendation.data.description && (
                                      <div className="md:col-span-2">
                                        <p><strong>詳細介紹:</strong> {recommendation.data.description}</p>
                                      </div>
                                    )}
                                    {recommendation.data.ingredients && (
                                      <div className="md:col-span-2">
                                        <p><strong>推薦配方成份:</strong> {recommendation.data.ingredients}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 健康分數顯示 */}
                  {apiTestResult.scores && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-green-800">📊 健康分數</h3>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {Object.entries(apiTestResult.scores).map(([category, score]) => (
                          <div key={category} className="p-2 bg-white rounded border text-center">
                            <div className="font-semibold">{category}</div>
                            <div className="text-lg font-bold text-green-600">{score}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 最高分數項目 */}
                  {apiTestResult.top_categories && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-yellow-800">🏆 最高分數項目</h3>
                      <div className="flex space-x-4">
                        {apiTestResult.top_categories.map((item, index) => (
                          <div key={index} className="p-3 bg-white rounded border">
                            <div className="font-semibold">{item.category}</div>
                            <div className="text-lg font-bold text-yellow-600">{item.score}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 完整JSON結果 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">完整JSON結果</h3>
                    <pre className="text-sm overflow-auto max-h-96 bg-white p-4 rounded border">
                      {JSON.stringify(apiTestResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
