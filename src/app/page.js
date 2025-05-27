'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

export default function Home() {
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [weights, setWeights] = useState({});
  const [customWeights, setCustomWeights] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerWeights, setAnswerWeights] = useState({});
  const [selectedResponse, setSelectedResponse] = useState(null);

  // 頁籤狀態
  const [mainTab, setMainTab] = useState('responses');

  // 推薦商品狀態 { 1: { products: [], note: '', selectedItem: '' }, ... }
  const [recommendations, setRecommendations] = useState(
    Array.from({ length: 10 }, (_, i) => i + 1).reduce((acc, score) => {
      acc[score] = { products: [], note: '', selectedItem: '' };
      return acc;
    }, {})
  );

  // 新增：推薦商品九大項選擇
  const [selectedRecommendItem, setSelectedRecommendItem] = useState('');
  // 推薦商品暫存資料 { [item]: { 1: { products: [], note: '', productInput: '' }, ...10 } }
  const [recommendCache, setRecommendCache] = useState({});

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
    const res = await fetch('/api/get-response/ziqd4l0nxahn9naziqd42md29y1hc5la');
    const data = await res.json();
    console.log('問卷詳細fetchResponse', data);
  };

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
    fetchResponse();
    fetchProducts();
    fetchCustomers();
    fetchCustomers('655336');
  }, []);

  // 分數輸入處理
  const handleWeightChange = (id, value) => {
    setWeights((prev) => ({ ...prev, [id]: value }));
  };

  // 圖片九個項目
  const customItems = [
    "腸胃", "關節", "泌尿", "皮毛", "情緒", "體重", "心血管", "眼睛", "免疫"
  ];

  // 分數輸入處理
  const handleCustomWeightChange = (item, value) => {
    setCustomWeights((prev) => ({ ...prev, [item]: value }));
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

  // 處理答案分數變更
  const handleAnswerWeightChange = (questionId, answerId, item, value) => {
    setAnswerWeights(prev => {
      const newWeights = {
        ...prev,
        [questionId]: {
          ...(prev[questionId] || {}),
          [answerId]: {
            ...((prev[questionId] && prev[questionId][answerId]) || {}),
            [item]: value
          }
        }
      };
      console.log('暫存分數資料:', newWeights);
      return newWeights;
    });
  };

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

  // 處理產品編碼輸入
  const handleProductInput = (score, value) => {
    setRecommendations(prev => {
      const newData = {
        ...prev,
        [score]: {
          ...prev[score],
          productInput: value
        }
      };
      console.log('推薦商品暫存資料:', newData);
      return newData;
    });
  };

  // 新增產品編碼
  const addProduct = (score) => {
    setRecommendations(prev => {
      const input = prev[score].productInput?.trim();
      if (!input) return prev;
      if (prev[score].products.includes(input)) {
        alert('產品編號重複');
        return prev;
      }
      const newData = {
        ...prev,
        [score]: {
          ...prev[score],
          products: [...prev[score].products, input],
          productInput: ''
        }
      };
      console.log('推薦商品暫存資料:', newData);
      return newData;
    });
  };

  // 刪除產品編碼
  const removeProduct = (score, code) => {
    setRecommendations(prev => {
      const newData = {
        ...prev,
        [score]: {
          ...prev[score],
          products: prev[score].products.filter(p => p !== code)
        }
      };
      console.log('推薦商品暫存資料:', newData);
      return newData;
    });
  };

  // 處理備註
  const handleNoteChange = (score, value) => {
    setRecommendations(prev => {
      const newData = {
        ...prev,
        [score]: {
          ...prev[score],
          note: value
        }
      };
      console.log('推薦商品暫存資料:', newData);
      return newData;
    });
  };

  // 處理九大項選擇
  const handleItemSelect = (score, item) => {
    setRecommendations(prev => ({
      ...prev,
      [score]: {
        ...prev[score],
        selectedItem: item
      }
    }));
  };

  // 切換九大項時，若無資料則初始化
  const handleRecommendItemChange = (item) => {
    setSelectedRecommendItem(item);
    setRecommendCache(prev => {
      if (!item) return prev;
      if (prev[item]) return prev;
      // 初始化1~10分的資料
      return {
        ...prev,
        [item]: Array.from({ length: 10 }, (_, i) => i + 1).reduce((acc, score) => {
          acc[score] = { products: [], note: '', productInput: '' };
          return acc;
        }, {})
      };
    });
  };

  // 推薦商品輸入處理（針對九大項+分數）
  const handleRecommendProductInput = (score, value) => {
    if (!selectedRecommendItem) return;
    setRecommendCache(prev => ({
      ...prev,
      [selectedRecommendItem]: {
        ...prev[selectedRecommendItem],
        [score]: {
          ...prev[selectedRecommendItem][score],
          productInput: value
        }
      }
    }));
  };
  // 新增推薦商品
  const addRecommendProduct = (score) => {
    if (!selectedRecommendItem) return;
    setRecommendCache(prev => {
      const input = prev[selectedRecommendItem][score].productInput?.trim();
      if (!input) return prev;
      if (prev[selectedRecommendItem][score].products.includes(input)) {
        alert('產品編號重複');
        return prev;
      }
      return {
        ...prev,
        [selectedRecommendItem]: {
          ...prev[selectedRecommendItem],
          [score]: {
            ...prev[selectedRecommendItem][score],
            products: [...prev[selectedRecommendItem][score].products, input],
            productInput: ''
          }
        }
      };
    });
  };
  // 刪除推薦商品
  const removeRecommendProduct = (score, code) => {
    if (!selectedRecommendItem) return;
    setRecommendCache(prev => ({
      ...prev,
      [selectedRecommendItem]: {
        ...prev[selectedRecommendItem],
        [score]: {
          ...prev[selectedRecommendItem][score],
          products: prev[selectedRecommendItem][score].products.filter(p => p !== code)
        }
      }
    }));
  };
  // 備註暫存
  const handleRecommendNoteChange = (score, value) => {
    if (!selectedRecommendItem) return;
    setRecommendCache(prev => ({
      ...prev,
      [selectedRecommendItem]: {
        ...prev[selectedRecommendItem],
        [score]: {
          ...prev[selectedRecommendItem][score],
          note: value
        }
      }
    }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <main className="min-h-screen bg-gray-100 p-6">
            {/* 頁籤切換 */}
            <div className="flex space-x-8 mb-8 border-b border-gray-300">
              <button
                className={`px-6 py-2 font-semibold transition-colors duration-200 border-b-4 ${
                  mainTab === 'responses'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-blue-700'
                }`}
                onClick={() => setMainTab('responses')}
              >
                Typeform回覆資料
              </button>
              <button
                className={`px-6 py-2 font-semibold transition-colors duration-200 border-b-4 ${
                  mainTab === 'weight'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-blue-700'
                }`}
                onClick={() => setMainTab('weight')}
              >
                設定分數
              </button>
              <button
                className={`px-6 py-2 font-semibold transition-colors duration-200 border-b-4 ${
                  mainTab === 'recommend'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-blue-700'
                }`}
                onClick={() => setMainTab('recommend')}
              >
                推薦商品
              </button>
            </div>

            {/* 內容區塊 */}
            {mainTab === 'responses' && (
              <section className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-blue-700">Typeform 回覆資料</h2>
                {selectedResponse ? (
                  <div>
                    <button
                      className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      onClick={() => setSelectedResponse(null)}
                    >返回列表</button>
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
                                className="text-blue-600 underline hover:text-blue-800"
                                onClick={() => setSelectedResponse(res)}
                              >
                                {res.user_name || `使用者 #${index + 1}`}
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
            )}

            {mainTab === 'weight' && (
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
                                      className="w-15 px-2 py-1 border rounded"
                                      value={answerWeights[selectedQuestion.id]?.[answer.id]?.[item] || ''}
                                      onChange={(e) => handleAnswerWeightChange(selectedQuestion.id, answer.id, item, e.target.value)}
                                      placeholder="1~5"
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
            )}

            {mainTab === 'recommend' && (
              <section className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-blue-700">推薦商品</h2>
                {/* 九大項選擇 */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    請選擇九大項
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={selectedRecommendItem}
                    onChange={e => handleRecommendItemChange(e.target.value)}
                  >
                    <option value="">請選擇九大項</option>
                    {customItems.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                {/* 只有選擇九大項才顯示表格 */}
                {selectedRecommendItem && recommendCache[selectedRecommendItem] && (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border border-gray-300 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border p-2 text-left">分數</th>
                          <th className="border p-2 text-left">推薦商品（產品編碼）</th>
                          <th className="border p-2 text-left">備註</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
                          <tr key={score} className="bg-white">
                            <td className="border p-2 font-bold text-center">{score}</td>
                            <td className="border p-2">
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    className="w-32 px-2 py-1 border rounded"
                                    placeholder="輸入產品編碼"
                                    value={recommendCache[selectedRecommendItem][score].productInput || ''}
                                    onChange={e => handleRecommendProductInput(score, e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') addRecommendProduct(score); }}
                                  />
                                  <button
                                    type="button"
                                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => addRecommendProduct(score)}
                                  >新增</button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {recommendCache[selectedRecommendItem][score].products.map(code => (
                                    <span key={code} className="inline-flex items-center bg-gray-200 px-2 py-0.5 rounded text-xs">
                                      {code}
                                      <button
                                        type="button"
                                        className="ml-1 text-red-500 hover:text-red-700"
                                        onClick={() => removeRecommendProduct(score, code)}
                                      >×</button>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="border p-2">
                              <textarea
                                className="w-full px-2 py-1 border rounded"
                                rows={2}
                                placeholder="備註"
                                value={recommendCache[selectedRecommendItem][score].note}
                                onChange={e => handleRecommendNoteChange(score, e.target.value)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
