'use client';

import { useState } from 'react';

export default function PetIntroductions() {
  // 寵物健康項目（固定項目）
  const petHealthItems = [
    "關節與肢體結構發展",
    "皮毛與皮膚狀況", 
    "心血管功能與耐力表現",
    "情緒穩定與壓力管理",
    "視覺健康與退化性疾病"
  ];

  // 寵物介紹狀態
  const [petIntroductions, setPetIntroductions] = useState({
    cat: {
      "米克斯貓": {
        description: "米克斯貓是混種貓的統稱，具有多樣化的外觀特徵和性格。",
        healthItems: {
          "關節與肢體結構發展": "米克斯貓的關節健康狀況因遺傳背景而異，需要定期檢查關節靈活性。",
          "皮毛與皮膚狀況": "混種貓的皮毛質地多樣，需要根據具體毛質選擇適當的護理方式。",
          "心血管功能與耐力表現": "一般來說體質較為強健，但仍需注意心臟健康。",
          "情緒穩定與壓力管理": "適應性較強，但個體差異較大，需要個別觀察。",
          "視覺健康與退化性疾病": "需要定期檢查眼睛健康，預防常見的眼部疾病。"
        }
      },
      "英國短毛貓": {
        description: "英國短毛貓體型圓潤，性格溫和，是理想的家庭伴侶貓。",
        healthItems: {
          "關節與肢體結構發展": "體型較為圓潤，需要注意關節負擔，避免過度肥胖。",
          "皮毛與皮膚狀況": "短毛易於護理，但需要定期梳理以減少毛球問題。",
          "心血管功能與耐力表現": "體型較大，需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格溫和穩定，適應性良好。",
          "視覺健康與退化性疾病": "需要定期檢查眼睛，預防遺傳性眼部疾病。"
        }
      },
      // ... 其他貓品種資料保持不變 ...
    },
    dog: {
      "米克斯": {
        description: "米克斯是混種狗的統稱，具有多樣化的外觀特徵和性格。",
        healthItems: {
          "關節與肢體結構發展": "混種狗的健康狀況因遺傳背景而異，需要個別評估。",
          "皮毛與皮膚狀況": "毛質多樣，需要根據具體品種選擇護理方式。",
          "心血管功能與耐力表現": "一般來說體質較為強健，但仍需注意心臟健康。",
          "情緒穩定與壓力管理": "適應性較強，但個體差異較大。",
          "視覺健康與退化性疾病": "需要定期檢查眼睛健康，預防常見疾病。"
        }
      },
      // ... 其他狗品種資料保持不變 ...
    }
  });

  const [selectedPetType, setSelectedPetType] = useState(''); // 'cat' 或 'dog'
  const [selectedPetBreed, setSelectedPetBreed] = useState('');
  const [newBreedName, setNewBreedName] = useState('');
  const [isAddingNewBreed, setIsAddingNewBreed] = useState(false);
  const [breedSearchTerm, setBreedSearchTerm] = useState('');
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const [isRenamingBreed, setIsRenamingBreed] = useState(false);
  const [renameBreedName, setRenameBreedName] = useState('');

  // 寵物介紹相關函數
  const handlePetTypeChange = (petType) => {
    setSelectedPetType(petType);
    setSelectedPetBreed('');
    setBreedSearchTerm('');
    setShowBreedDropdown(false);
  };

  const handlePetBreedChange = (breed) => {
    setSelectedPetBreed(breed);
    setBreedSearchTerm(breed);
    setShowBreedDropdown(false);
    if (breed && selectedPetType && !petIntroductions[selectedPetType][breed]) {
      // 如果選擇的品種沒有資料，初始化
      setPetIntroductions(prev => ({
        ...prev,
        [selectedPetType]: {
          ...prev[selectedPetType],
        [breed]: {
          description: '',
          healthItems: petHealthItems.reduce((acc, item) => {
            acc[item] = '';
            return acc;
          }, {})
          }
        }
      }));
    }
  };

  // 過濾品種列表
  const filteredBreeds = selectedPetType ? Object.keys(petIntroductions[selectedPetType] || {}).filter(breed =>
    breed.toLowerCase().includes(breedSearchTerm.toLowerCase())
  ) : [];

  // 處理搜尋輸入
  const handleBreedSearchChange = (value) => {
    setBreedSearchTerm(value);
    setShowBreedDropdown(true);
    if (value === '') {
      setSelectedPetBreed('');
    }
  };

  const handleAddNewBreed = () => {
    if (!newBreedName.trim() || !selectedPetType) return;
    const breedName = newBreedName.trim();
    setPetIntroductions(prev => ({
      ...prev,
      [selectedPetType]: {
        ...prev[selectedPetType],
      [breedName]: {
        description: '',
        healthItems: petHealthItems.reduce((acc, item) => {
          acc[item] = '';
          return acc;
        }, {})
        }
      }
    }));
    setSelectedPetBreed(breedName);
    setBreedSearchTerm(breedName);
    setNewBreedName('');
    setIsAddingNewBreed(false);
    setShowBreedDropdown(false);
  };

  // 開始重新命名品種
  const handleStartRenameBreed = () => {
    if (!selectedPetBreed) return;
    setRenameBreedName(selectedPetBreed);
    setIsRenamingBreed(true);
  };

  // 確認重新命名品種
  const handleConfirmRenameBreed = () => {
    if (!renameBreedName.trim() || !selectedPetType || !selectedPetBreed) return;
    const newBreedName = renameBreedName.trim();
    if (newBreedName === selectedPetBreed) {
      setIsRenamingBreed(false);
      return;
    }
    
    // 檢查新名稱是否已存在
    if (petIntroductions[selectedPetType][newBreedName]) {
      alert('品種名稱已存在');
      return;
    }

    // 重新命名品種
    setPetIntroductions(prev => {
      const currentData = prev[selectedPetType][selectedPetBreed];
      const newData = {
        ...prev,
        [selectedPetType]: {
          ...prev[selectedPetType],
          [newBreedName]: currentData
        }
      };
      // 刪除舊的品種名稱
      delete newData[selectedPetType][selectedPetBreed];
      return newData;
    });
    
    setSelectedPetBreed(newBreedName);
    setBreedSearchTerm(newBreedName);
    setIsRenamingBreed(false);
    setRenameBreedName('');
  };

  // 取消重新命名
  const handleCancelRenameBreed = () => {
    setIsRenamingBreed(false);
    setRenameBreedName('');
  };

  const handlePetDescriptionChange = (value) => {
    if (!selectedPetBreed || !selectedPetType) return;
    setPetIntroductions(prev => ({
      ...prev,
      [selectedPetType]: {
        ...prev[selectedPetType],
      [selectedPetBreed]: {
          ...prev[selectedPetType][selectedPetBreed],
        description: value
        }
      }
    }));
  };

  const handlePetHealthItemChange = (item, value) => {
    if (!selectedPetBreed || !selectedPetType) return;
    setPetIntroductions(prev => ({
      ...prev,
      [selectedPetType]: {
        ...prev[selectedPetType],
      [selectedPetBreed]: {
          ...prev[selectedPetType][selectedPetBreed],
        healthItems: {
            ...prev[selectedPetType][selectedPetBreed].healthItems,
          [item]: value
          }
        }
      }
    }));
  };

  const handleSavePetIntroduction = () => {
    if (!selectedPetBreed || !selectedPetType) return;
    // 這裡可以加入 API 呼叫來儲存資料
    console.log('儲存寵物介紹:', selectedPetType, selectedPetBreed, petIntroductions[selectedPetType][selectedPetBreed]);
    alert('寵物介紹儲存成功！');
  };

  return (
    <section className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">寵物介紹管理</h2>
      
      {/* 寵物類型選擇 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          選擇寵物類型
        </label>
        <div className="flex gap-4">
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedPetType === 'cat'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-orange-100'
            }`}
            onClick={() => handlePetTypeChange('cat')}
          >
            🐱 貓星人
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedPetType === 'dog'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
            onClick={() => handlePetTypeChange('dog')}
          >
            🐶 汪星人
          </button>
        </div>
      </div>
      
      {/* 品種選擇 */}
      {selectedPetType && (
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
           選擇{selectedPetType === 'cat' ? '貓' : '狗'}品種
        </label>
        <div className="flex gap-6 items-center">
          {/* 搜尋式下拉選單 */}
          <div className="relative w-80">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="搜尋或輸入品種名稱..."
              value={breedSearchTerm}
              onChange={(e) => handleBreedSearchChange(e.target.value)}
              onFocus={() => setShowBreedDropdown(true)}
              onBlur={() => setTimeout(() => setShowBreedDropdown(false), 200)}
            />
            
            {/* 下拉選單 */}
            {showBreedDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredBreeds.length > 0 ? (
                  filteredBreeds.map(breed => (
                    <div
                      key={breed}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handlePetBreedChange(breed)}
                    >
                      {breed}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">
                    沒有找到匹配的品種
                  </div>
                )}
              </div>
            )}
          </div>
          
          {!isAddingNewBreed ? (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-bold"
              onClick={() => setIsAddingNewBreed(true)}
            >
              新增品種
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md"
                placeholder="輸入新品種名稱"
                value={newBreedName}
                onChange={(e) => setNewBreedName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddNewBreed(); }}
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold"
                onClick={handleAddNewBreed}
              >
                確認
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-bold"
                onClick={() => {
                  setIsAddingNewBreed(false);
                  setNewBreedName('');
                }}
              >
                取消
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* 寵物介紹編輯 */}
      {selectedPetBreed && selectedPetType && petIntroductions[selectedPetType] && petIntroductions[selectedPetType][selectedPetBreed] && (
        <div className="space-y-6">
          {/* 品種標題和重新命名 */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              {selectedPetType === 'cat' ? '��' : '🐶'} {selectedPetBreed} 介紹
            </h3>
            <div className="flex gap-2">
              {!isRenamingBreed ? (
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-bold text-sm"
                  onClick={handleStartRenameBreed}
                >
                  重新命名
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="輸入新品種名稱"
                    value={renameBreedName}
                    onChange={(e) => setRenameBreedName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmRenameBreed(); }}
                  />
                  <button
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-bold text-sm"
                    onClick={handleConfirmRenameBreed}
                  >
                    確認
                  </button>
                  <button
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-bold text-sm"
                    onClick={handleCancelRenameBreed}
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 品種簡述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedPetBreed} 簡述
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="請輸入品種的基本介紹..."
              value={petIntroductions[selectedPetType][selectedPetBreed].description}
              onChange={(e) => handlePetDescriptionChange(e.target.value)}
            />
          </div>

          {/* 健康項目表格 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">健康關注項目</h3>
            <div className="overflow-x-auto">
              <table className="table-fixed w-full border border-gray-300 text-sm">
                <colgroup>
                  <col style={{width: '30%'}} />
                  <col style={{width: '70%'}} />
                </colgroup>
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">健康項目</th>
                    <th className="border p-2 text-left">內容說明</th>
                  </tr>
                </thead>
                <tbody>
                  {petHealthItems.map((item) => (
                    <tr key={item} className="bg-white">
                      <td className="border p-2 font-medium">{item}</td>
                      <td className="border p-2">
                        <textarea
                          className="w-full px-2 py-1 border rounded"
                          rows={3}
                          placeholder={`請輸入${item}的詳細說明...`}
                          value={petIntroductions[selectedPetType][selectedPetBreed].healthItems[item] || ''}
                          onChange={(e) => handlePetHealthItemChange(item, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 儲存按鈕 */}
          <div className="flex justify-end  mt-4">
            <button
              className="px-6 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600"
              onClick={handleSavePetIntroduction}
            >
              儲存寵物介紹
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
