'use client';

import { useState, useEffect } from 'react';

export default function ScoreSettings({ questions, answerWeights, setAnswerWeights }) {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 健康項目列表
  const customItems = [
    '腸胃', '關節', '泌尿', '皮毛', '情緒', 
    '體重', '心血管', '眼睛', '免疫'
  ];

  // 取得問題的答案選項
  const getQuestionAnswers = (question) => {
    if (!question || !question.properties) return [];
    
    if (question.properties.choices) {
      return question.properties.choices;
    }
    
    return [];
  };

  // 處理分數變更
  const handleScoreChange = (questionId, answerId, category, value) => {
    const numValue = parseFloat(value) || 0;
    
    setAnswerWeights(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [answerId]: {
          ...prev[questionId]?.[answerId],
          [category]: numValue
        }
      }
    }));
  };

  // 取得分數值
  const getScoreValue = (questionId, answerId, category) => {
    return answerWeights[questionId]?.[answerId]?.[category] || 0;
  };

  // 從 MongoDB 載入分數權重
  const loadAnswerWeightsFromDB = async () => {
    if (!selectedQuestion) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/answer-weights?questionId=${selectedQuestion.id}`);
      const result = await res.json();
      
      if (result.success && result.answerWeight) {
        // 載入已儲存的權重資料
        setAnswerWeights(prev => ({
          ...prev,
          [selectedQuestion.id]: result.answerWeight.answerWeights
        }));
        console.log('已載入分數權重資料');
      } else {
        // 沒有找到資料，初始化為空
        setAnswerWeights(prev => ({
          ...prev,
          [selectedQuestion.id]: {}
        }));
        console.log('沒有找到已儲存的資料，初始化為空');
      }
    } catch (error) {
      console.error('載入錯誤:', error);
      alert('載入失敗：' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 當選擇問題改變時，自動載入資料
  useEffect(() => {
    if (selectedQuestion) {
      loadAnswerWeightsFromDB();
    }
  }, [selectedQuestion]);

  // 儲存分數權重到資料庫
  const handleSaveAnswerWeights = async () => {
    if (!selectedQuestion) {
      alert('請先選擇問題');
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        questionId: selectedQuestion.id,
        questionTitle: selectedQuestion.title,
        answerWeights: answerWeights[selectedQuestion.id] || {}
      };

      const res = await fetch('/api/answer-weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      
      if (result.success) {
        alert('分數權重儲存成功！');
      } else {
        alert('儲存失敗：' + result.error);
      }
    } catch (error) {
      console.error('儲存錯誤:', error);
      alert('儲存失敗：' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 手動重新載入資料
  const handleReloadAnswerWeights = async () => {
    if (!selectedQuestion) {
      alert('請先選擇問題');
      return;
    }
    await loadAnswerWeightsFromDB();
  };

  return (
    <section className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">設定分數</h2>
      
      {/* 問題選擇 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          選擇問題
        </label>
        <div className="flex gap-4">
          <select
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedQuestion ? selectedQuestion.id : ''}
            onChange={(e) => {
              const question = questions.find(q => q.id === e.target.value);
              setSelectedQuestion(question);
            }}
          >
            <option value="">請選擇問題</option>
            {questions.map((question) => (
              <option key={question.id} value={question.id}>
                {question.title}
              </option>
            ))}
          </select>
          
          {selectedQuestion && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold disabled:opacity-50"
              onClick={handleReloadAnswerWeights}
              disabled={isLoading}
            >
              {isLoading ? '載入中...' : '重新載入'}
            </button>
          )}
        </div>
      </div>

      {/* 載入狀態提示 */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
          正在從資料庫載入分數權重資料...
        </div>
      )}

      {/* 分數設定表格 */}
      {selectedQuestion && (
        <div className="relative">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">答案選項</th>
                  {customItems.map((item) => (
                    <th key={item} className="border p-2 text-center min-w-[80px]">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getQuestionAnswers(selectedQuestion).map((answer) => (
                  <tr key={answer.id} className="bg-white">
                    <td className="border p-2 font-medium">
                      {answer.label || answer.text}
                    </td>
                    {customItems.map((category) => (
                      <td key={category} className="border p-2">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          className="w-full px-2 py-1 border rounded text-center"
                          value={getScoreValue(selectedQuestion.id, answer.id, category)}
                          onChange={(e) => handleScoreChange(selectedQuestion.id, answer.id, category, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 儲存按鈕 - 放在表格右下角 */}
          <div className="flex justify-end mt-4">
            <button
              className="px-6 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600 disabled:opacity-50"
              onClick={handleSaveAnswerWeights}
              disabled={isSaving || isLoading}
            >
              {isSaving ? '儲存中...' : '儲存分數權重'}
            </button>
          </div>
        </div>
      )}

      {/* 說明文字 */}
      <div className="mt-4 text-sm text-gray-600">
        <p>• 請為每個答案選項設定對應的健康項目分數</p>
        <p>• 分數範圍：0-10，可設定小數點後一位</p>
        <p>• 空白或0表示該答案對該健康項目無影響</p>
        <p>• 選擇問題後會自動從資料庫載入已儲存的權重設定</p>
        <p>• 點擊「重新載入」可重新從資料庫載入資料</p>
        <p>• 點擊「儲存分數權重」可將當前設定儲存到資料庫</p>
      </div>
    </section>
  );
}
