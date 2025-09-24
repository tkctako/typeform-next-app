'use client';

import { useState, useEffect } from 'react';

export default function TypeformResponses({ questions }) {
  const [responses, setResponses] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);

  // 取得回覆資料
  const fetchResponses = async () => {
    const res = await fetch('/api/get-responses');
    const data = await res.json();
    console.log('fetchResponses', data);
    setResponses(data.items || []);
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  return (
    <section className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Typeform 回覆資料</h2>
      {selectedResponse ? (
        <div>
          <button
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-bold"
            onClick={() => setSelectedResponse(null)}
          >
            返回列表
          </button>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-700 font-medium mb-2">回覆詳細</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {selectedResponse.answers.map((ans, i) => {
                const question = questions.find(q => q.id === ans.field?.id);
                return (
                  <li key={i}>
                    <span className="font-semibold">{question ? question.title : ans.field?.id}：</span>
                    {ans.type === 'text' && ` ${ans.text}`}
                    {ans.type === 'boolean' && ` ${ans.boolean ? '是' : '否'}`}
                    {ans.type === 'choice' && ` ${ans.choice?.label || JSON.stringify(ans.choice)}`}
                    {ans.type === 'choices' && ans.choices?.labels
                      ? ` ${ans.choices.labels.join(', ')}`
                      : ans.type === 'choices' && JSON.stringify(ans.choices)}
                    {['text', 'boolean', 'choice', 'choices'].indexOf(ans.type) === -1 && ` ${JSON.stringify(ans[ans.type])}`}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        responses.length === 0 ? (
          <p className="text-gray-400">尚無回覆資料</p>
        ) : (
          <table className="table-auto w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">使用者名稱</th>
                <th className="border p-2 text-left">日期</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((res, index) => (
                <tr key={res.response_id} className="bg-white">
                  <td className="border p-2">
                    <button
                      className="cursor-pointer text-blue-600 underline hover:text-blue-800"
                      onClick={() => setSelectedResponse(res)}
                    >
                      {res.hidden.customer_email || `使用者 #${index + 1}`}
                    </button>
                  </td>
                  <td className="border p-2">
                    {res.submitted_at ? new Date(res.submitted_at).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </section>
  );
}
