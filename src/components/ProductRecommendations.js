'use client';

import { useState, useEffect } from 'react';

export default function ProductRecommendations() {
  // 九大項英文代碼與中文對照
  const itemMap = {
    digestive: "腸胃",
    joint: "關節",
    urinary: "泌尿",
    skin: "皮毛",
    emotion: "情緒",
    weight: "體重",
    cardiovascular: "心血管",
    eye: "眼睛",
    immune: "免疫"
  };

  // 新增：推薦商品九大項選擇
  const [selectedRecommendItem, setSelectedRecommendItem] = useState('');
  // 推薦商品暫存資料 { [item]: { 0: { products: [], note: '', productInput: '', description: '', ingredients: '', formula: '' }, ...10 } }
  const [recommendCache, setRecommendCache] = useState({});

  // 切換九大項時，若無資料則初始化
  const handleRecommendItemChange = async (item) => {
    setSelectedRecommendItem(item);

    if (!item) return;

    // 查詢該 item 是否有推薦資料
    const res = await fetch(`/api/recommend?item=${item}`);
    const data = await res.json();

    setRecommendCache(prev => {
      if (data.success && data.recommend && data.recommend.scores) {
        // 有資料，直接帶入
        return {
          ...prev,
          [item]: data.recommend.scores
        };
      } else {
        // 沒有資料，初始化
        return {
          ...prev,
          [item]: Array.from({ length: 11 }, (_, i) => i).reduce((acc, score) => {
            acc[score] = { products: [], note: '', productInput: '', description: '', ingredients: '', formula: '' };
            return acc;
          }, {})
        };
      }
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
          ...(prev[selectedRecommendItem]?.[score] || {}),
          productInput: value
        }
      }
    }));
  };

  // 新增推薦商品
  const addRecommendProduct = (score) => {
    if (!selectedRecommendItem) return;
    setRecommendCache(prev => {
      const input = prev[selectedRecommendItem]?.[score]?.productInput?.trim();
      if (!input) return prev;
      const currentProducts = prev[selectedRecommendItem]?.[score]?.products || [];
      if (currentProducts.includes(input)) {
        alert('產品編號重複');
        return prev;
      }
      return {
        ...prev,
        [selectedRecommendItem]: {
          ...prev[selectedRecommendItem],
          [score]: {
            ...(prev[selectedRecommendItem]?.[score] || {}),
            products: [...currentProducts, input],
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
          ...(prev[selectedRecommendItem]?.[score] || {}),
          products: (prev[selectedRecommendItem]?.[score]?.products || []).filter(p => p !== code)
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
          ...(prev[selectedRecommendItem]?.[score] || {}),
          note: value
        }
      }
    }));
  };

  // 詳細介紹暫存
  const handleRecommendDescriptionChange = (score, value) => {
    if (!selectedRecommendItem) return;
    setRecommendCache(prev => ({
      ...prev,
      [selectedRecommendItem]: {
        ...prev[selectedRecommendItem],
        [score]: {
          ...(prev[selectedRecommendItem]?.[score] || {}),
          description: value
        }
      }
    }));
  };

  // 推薦配方成份暫存
  const handleRecommendIngredientsChange = (score, value) => {
    if (!selectedRecommendItem) return;
    setRecommendCache(prev => ({
      ...prev,
      [selectedRecommendItem]: {
        ...prev[selectedRecommendItem],
        [score]: {
          ...(prev[selectedRecommendItem]?.[score] || {}),
          ingredients: value
        }
      }
    }));
  };

  // 對應配方暫存
  const handleRecommendFormulaChange = (score, value) => {
    if (!selectedRecommendItem) return;
    setRecommendCache(prev => ({
      ...prev,
      [selectedRecommendItem]: {
        ...prev[selectedRecommendItem],
        [score]: {
          ...(prev[selectedRecommendItem]?.[score] || {}),
          formula: value
        }
      }
    }));
  };

  const handleSaveRecommend = async () => {
    if (!selectedRecommendItem) return;
    const data = {
      item: selectedRecommendItem, // 這裡是英文代碼
      scores: recommendCache[selectedRecommendItem]
    };
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      alert('儲存成功！');
    } else {
      alert('儲存失敗：' + result.error);
    }
  };

  return (
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
          {Object.entries(itemMap).map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
      </div>

      {/* 只有選擇九大項才顯示表格 */}
      {selectedRecommendItem && recommendCache[selectedRecommendItem] && (
        <div className="overflow-x-auto">
          <table className="table-fixed w-full border border-gray-300 text-sm">
            <colgroup>
              <col style={{width: '8%'}} />
              <col style={{width: '20%'}} />
              <col style={{width: '12%'}} />
              <col style={{width: '25%'}} />
              <col style={{width: '17%'}} />
              <col style={{width: '18%'}} />
            </colgroup>
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">分數</th>
                <th className="border p-2 text-left">推薦商品（產品編碼）</th>
                <th className="border p-2 text-left">建議關注大綱</th>
                <th className="border p-2 text-left">詳細介紹</th>
                <th className="border p-2 text-left">推薦配方成份</th>
                <th className="border p-2 text-left">對應配方</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 11 }, (_, i) => i).map(score => (
                <tr key={score} className="bg-white">
                  <td className="border p-2 font-bold text-center">{score}</td>
                  <td className="border p-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="w-32 px-2 py-1 border rounded"
                          placeholder="輸入產品編碼"
                          value={recommendCache[selectedRecommendItem]?.[score]?.productInput || ''}
                          onChange={e => handleRecommendProductInput(score, e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') addRecommendProduct(score); }}
                        />
                        <button
                          type="button"
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold"
                          onClick={() => addRecommendProduct(score)}
                        >新增</button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(recommendCache[selectedRecommendItem]?.[score]?.products || []).map(code => (
                          <span key={code} className="inline-flex items-center bg-gray-200 px-2 py-0.5 rounded text-xs">
                            {code}
                            <button
                              type="button"
                              className="ml-1 text-red-500 hover:text-red-700 font-bold"
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
                      rows={3}
                      placeholder="建議關注大綱"
                      value={recommendCache[selectedRecommendItem]?.[score]?.note || ''}
                      onChange={e => handleRecommendNoteChange(score, e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <textarea
                      className="w-full px-2 py-1 border rounded"
                      rows={3}
                      placeholder="詳細介紹"
                      value={recommendCache[selectedRecommendItem]?.[score]?.description || ''}
                      onChange={e => handleRecommendDescriptionChange(score, e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <textarea
                      className="w-full px-2 py-1 border rounded"
                      rows={3}
                      placeholder="推薦配方成份"
                      value={recommendCache[selectedRecommendItem]?.[score]?.ingredients || ''}
                      onChange={e => handleRecommendIngredientsChange(score, e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <textarea
                      className="w-full px-2 py-1 border rounded"
                      rows={3}
                      placeholder="對應配方"
                      value={recommendCache[selectedRecommendItem]?.[score]?.formula || ''}
                      onChange={e => handleRecommendFormulaChange(score, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded font-bold"
          onClick={handleSaveRecommend}
        >
          儲存推薦資料
        </button>
      </div>
    </section>
  );
}
