'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [weights, setWeights] = useState({});
  const [customWeights, setCustomWeights] = useState({});

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
  const fetchResponses = async () => {
    const res = await fetch('/api/get-responses');
    const data = await res.json();
    console.log('fetchResponses', data);
    setResponses(data.items || []);
  };

  // 取得題目資料
  const fetchQuestions = async () => {
    const res = await fetch('/api/get-questions');
    const data = await res.json();
    console.log('fetchQuestions', data);
    setQuestions(data.fields || []);
  };

  useEffect(() => {
    fetchResponses();
    fetchQuestions();
  }, []);

  // 權重輸入處理
  const handleWeightChange = (id, value) => {
    setWeights((prev) => ({ ...prev, [id]: value }));
  };

  // 圖片九個項目
  const customItems = [
    "腸胃", "關節", "泌尿", "皮毛", "情緒", "體重", "心血管", "眼睛", "免疫"
  ];

  // 權重輸入處理
  const handleCustomWeightChange = (item, value) => {
    setCustomWeights((prev) => ({ ...prev, [item]: value }));
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 space-y-10">
      <button onClick={sendMessage}>測試API</button>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Typeform 回覆資料</h2>
        {responses.length === 0 ? (
          <p className="text-gray-500">尚無回覆資料</p>
        ) : (
          <ul className="space-y-4">
            {responses.map((res, index) => (
              <li key={res.response_id} className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-700 font-medium">回覆 #{index + 1}</p>
                <ul className="list-disc list-inside text-sm mt-2 text-gray-600">
                  {res.answers.map((ans, i) => {
                    // 根據 field id 找到對應題目
                    const question = questions.find(q => q.id === ans.field?.id);
                    return (
                      <li key={i}>
                        {/* 顯示題目名稱，找不到就顯示 id */}
                        {question ? question.title : ans.field?.id}：
                        {ans.type === 'text' && ` ${ans.text}`}
                        {ans.type === 'boolean' && ` ${ans.boolean ? '是' : '否'}`}
                        {ans.type === 'choice' && ` ${ans.choice?.label || JSON.stringify(ans.choice)}`}
                        {ans.type === 'choices' && ans.choices?.labels
                          ? ` ${ans.choices.labels.join(', ')}`
                          : ans.type === 'choices' && JSON.stringify(ans.choices)}
                        {/* 其他型別 fallback */}
                        {['text', 'boolean', 'choice', 'choices'].indexOf(ans.type) === -1 && ` ${JSON.stringify(ans[ans.type])}`}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">設定題目權重</h2>
        {questions.length === 0 ? (
          <p className="text-gray-500">尚未載入題目</p>
        ) : (
          <table className="table-auto w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-left">題目</th>
                <th className="border p-2 text-left">類型</th>
                <th className="border p-2 text-left">設定權重</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="bg-white">
                  <td className="border p-2">{q.title}</td>
                  <td className="border p-2">{q.type}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-24 px-2 py-1 border rounded"
                      value={weights[q.id] || ''}
                      onChange={(e) => handleWeightChange(q.id, e.target.value)}
                      placeholder="0~100"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">設定九大項目權重</h2>
        <table className="table-auto w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">項目</th>
              <th className="border p-2 text-left">設定權重</th>
            </tr>
          </thead>
          <tbody>
            {customItems.map((item) => (
              <tr key={item} className="bg-white">
                <td className="border p-2">{item}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    className="w-24 px-2 py-1 border rounded"
                    value={customWeights[item] || ''}
                    onChange={(e) => handleCustomWeightChange(item, e.target.value)}
                    placeholder="0~100"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
