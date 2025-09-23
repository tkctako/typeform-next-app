'use client';

import { useState } from 'react';

export default function ScoreSettings({ questions, answerWeights, setAnswerWeights }) {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // 九大項分類
  const customItems = [
    "腸胃", "關節", "泌尿", "皮毛", "情緒", "體重", "心血管", "眼睛", "免疫"
  ];

  // 獲取題目的所有可能答案
  const getQuestionAnswers = (question) => {
    if (!question) return [];
    // 如果有 choices，就返回 label
    if (question.properties?.choices) {
      return question.properties.choices.map(choice => ({
        id: choice.id,
        label: choice.label
      }));
    }
    // yes_no 类型
    if (question.type === 'yes_no') {
      return [
        { id: 'yes', label: 'yes' },
        { id: 'no', label: 'no' }
      ];
    }
    // 其他类型可以按需扩展
    switch (question.type) {
      case 'boolean':
        return [{ id: 'true', label: '是' }, { id: 'false', label: '否' }];
      default:
        return [];
    }
  };

  return (
    <section className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">設定分數</h2>
      
      {/* 題目選擇 */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          選擇題目
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={selectedQuestion?.id || ''}
          onChange={(e) => {
            const question = questions.find(q => q.id === e.target.value);
            setSelectedQuestion(question);
            console.log('選中的題目:', question);
            const answers = getQuestionAnswers(question);
            console.log('題目答案:', answers);
          }}
        >
          <option value="">請選擇題目</option>
          {questions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
      </div>

      {/* 答案分數設定表格 */}
      {selectedQuestion && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">設定答案分數</h3>
          {selectedQuestion.type?.includes('text') ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
              <p className="text-center">此題目為文字類型，不需要設定分數</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left w-1/3">答案</th>
                    {customItems.map(item => (
                      <th key={item} className="border p-2 text-left w-1/12">{item}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getQuestionAnswers(selectedQuestion).map((answer) => (
                    <tr key={answer.id} className="bg-white">
                      <td className="border p-2 w-1/3">{answer.label || answer.text}</td>
                      {customItems.map(item => (
                        <td key={item} className="border p-2 w-1/12">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="2"
                            className="w-15 px-2 py-1 border rounded text-center"
                            value={answerWeights[selectedQuestion.id]?.[answer.id]?.[item] || ''}
                            onChange={(e) => {
                              const value = e.target.value ? parseFloat(e.target.value) : '';
                              setAnswerWeights(prev => ({
                                ...prev,
                                [selectedQuestion.id]: {
                                  ...prev[selectedQuestion.id],
                                  [answer.id]: {
                                    ...prev[selectedQuestion.id]?.[answer.id],
                                    [item]: value
                                  }
                                }
                              }));
                            }}
                            placeholder="0-2"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
