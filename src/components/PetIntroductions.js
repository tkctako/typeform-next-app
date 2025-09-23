'use client';

import { useState, useEffect } from 'react';

export default function PetIntroductions() {
  // 寵物健康項目（固定項目）
  const petHealthItems = [
    "關節與肢體結構發展",
    "皮毛與皮膚狀況", 
    "心血管功能與耐力表現",
    "情緒穩定與壓力管理",
    "視覺健康與退化性疾病"
  ];

  // 寵物介紹狀態 - 從 MongoDB 讀取
  const [petIntroductions, setPetIntroductions] = useState({
    cat: {},
    dog: {}
  });

  const [selectedPetType, setSelectedPetType] = useState(''); // 'cat' 或 'dog'
  const [selectedPetBreed, setSelectedPetBreed] = useState('');
  const [newBreedName, setNewBreedName] = useState('');
  const [isAddingNewBreed, setIsAddingNewBreed] = useState(false);
  const [breedSearchTerm, setBreedSearchTerm] = useState('');
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const [isRenamingBreed, setIsRenamingBreed] = useState(false);
  const [renameBreedName, setRenameBreedName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 載入寵物品種資料
  const loadPetBreeds = async (petType) => {
    if (!petType) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/pet-breeds?petType=${petType}`);
      const result = await res.json();
      
      if (result.success && result.petBreeds) {
        // 轉換資料格式
        const breedsData = {};
        result.petBreeds.forEach(breed => {
          breedsData[breed.breedName] = {
            id: breed._id,
            description: breed.description,
            healthItems: breed.healthItems || {}
          };
        });

        setPetIntroductions(prev => ({
          ...prev,
          [petType]: breedsData
        }));
      }
    } catch (error) {
      console.error('載入寵物品種失敗:', error);
      alert('載入寵物品種失敗：' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 當選擇寵物類型時載入資料
  useEffect(() => {
    if (selectedPetType) {
      loadPetBreeds(selectedPetType);
    }
  }, [selectedPetType]);

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

  // 新增品種到資料庫
  const handleAddNewBreed = async () => {
    if (!newBreedName.trim() || !selectedPetType) return;
    
    const breedName = newBreedName.trim();
    setIsSaving(true);
    
    try {
      const breedData = {
        petType: selectedPetType,
        breedName: breedName,
        description: '',
        healthItems: petHealthItems.reduce((acc, item) => {
          acc[item] = '';
          return acc;
        }, {})
      };

      const res = await fetch('/api/pet-breeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(breedData)
      });

      const result = await res.json();
      
      if (result.success) {
        // 重新載入該類型的品種資料
        await loadPetBreeds(selectedPetType);
        setSelectedPetBreed(breedName);
        setBreedSearchTerm(breedName);
        setNewBreedName('');
        setIsAddingNewBreed(false);
        setShowBreedDropdown(false);
        alert('品種新增成功！');
      } else {
        alert('新增失敗：' + result.error);
      }
    } catch (error) {
      console.error('新增品種失敗:', error);
      alert('新增失敗：' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 開始重新命名品種
  const handleStartRenameBreed = () => {
    if (!selectedPetBreed) return;
    setRenameBreedName(selectedPetBreed);
    setIsRenamingBreed(true);
  };

  // 確認重新命名品種
  const handleConfirmRenameBreed = async () => {
    if (!renameBreedName.trim() || !selectedPetType || !selectedPetBreed) return;
    
    const newBreedName = renameBreedName.trim();
    if (newBreedName === selectedPetBreed) {
      setIsRenamingBreed(false);
      return;
    }

    setIsSaving(true);
    try {
      const breedId = petIntroductions[selectedPetType][selectedPetBreed]?.id;
      if (!breedId) {
        alert('找不到品種 ID');
        return;
      }

      const breedData = {
        petType: selectedPetType,
        breedName: newBreedName,
        description: petIntroductions[selectedPetType][selectedPetBreed]?.description || '',
        healthItems: petIntroductions[selectedPetType][selectedPetBreed]?.healthItems || {}
      };

      const res = await fetch(`/api/pet-breeds/${breedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(breedData)
      });

      const result = await res.json();
      
      if (result.success) {
        // 重新載入該類型的品種資料
        await loadPetBreeds(selectedPetType);
        setSelectedPetBreed(newBreedName);
        setBreedSearchTerm(newBreedName);
        setIsRenamingBreed(false);
        setRenameBreedName('');
        alert('品種重新命名成功！');
      } else {
        alert('重新命名失敗：' + result.error);
      }
    } catch (error) {
      console.error('重新命名失敗:', error);
      alert('重新命名失敗：' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 取消重新命名
  const handleCancelRenameBreed = () => {
    setIsRenamingBreed(false);
    setRenameBreedName('');
  };

  // 刪除品種
  const handleDeleteBreed = async () => {
    if (!selectedPetBreed || !selectedPetType) return;
    
    if (!confirm(`確定要刪除「${selectedPetBreed}」嗎？`)) return;

    setIsSaving(true);
    try {
      const breedId = petIntroductions[selectedPetType][selectedPetBreed]?.id;
      if (!breedId) {
        alert('找不到品種 ID');
        return;
      }

      const res = await fetch(`/api/pet-breeds/${breedId}`, {
        method: 'DELETE'
      });

      const result = await res.json();
      
      if (result.success) {
        // 重新載入該類型的品種資料
        await loadPetBreeds(selectedPetType);
        setSelectedPetBreed('');
        setBreedSearchTerm('');
        alert('品種刪除成功！');
      } else {
        alert('刪除失敗：' + result.error);
      }
    } catch (error) {
      console.error('刪除失敗:', error);
      alert('刪除失敗：' + error.message);
    } finally {
      setIsSaving(false);
    }
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

  // 儲存寵物介紹到資料庫
  const handleSavePetIntroduction = async () => {
    if (!selectedPetBreed || !selectedPetType) return;
    
    setIsSaving(true);
    try {
      const breedId = petIntroductions[selectedPetType][selectedPetBreed]?.id;
      if (!breedId) {
        alert('找不到品種 ID');
        return;
      }

      const breedData = {
        petType: selectedPetType,
        breedName: selectedPetBreed,
        description: petIntroductions[selectedPetType][selectedPetBreed].description,
        healthItems: petIntroductions[selectedPetType][selectedPetBreed].healthItems
      };

      const res = await fetch(`/api/pet-breeds/${breedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(breedData)
      });

      const result = await res.json();
      
      if (result.success) {
        alert('寵物介紹儲存成功！');
      } else {
        alert('儲存失敗：' + result.error);
      }
    } catch (error) {
      console.error('儲存失敗:', error);
      alert('儲存失敗：' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">寵物介紹管理</h2>
      
      {/* 載入狀態提示 */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
          正在從資料庫載入寵物品種資料...
        </div>
      )}
      
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
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-bold disabled:opacity-50"
              onClick={() => setIsAddingNewBreed(true)}
              disabled={isSaving}
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
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold disabled:opacity-50"
                onClick={handleAddNewBreed}
                disabled={isSaving}
              >
                {isSaving ? '新增中...' : '確認'}
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
          {/* 品種標題和操作按鈕 */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              {selectedPetType === 'cat' ? '��' : '🐶'} {selectedPetBreed} 介紹
            </h3>
            <div className="flex gap-2">
              {!isRenamingBreed ? (
                <>
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-bold text-sm disabled:opacity-50"
                    onClick={handleStartRenameBreed}
                    disabled={isSaving}
                  >
                    重新命名
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-bold text-sm disabled:opacity-50"
                    onClick={handleDeleteBreed}
                    disabled={isSaving}
                  >
                    刪除品種
                  </button>
                </>
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
                    className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-bold text-sm disabled:opacity-50"
                    onClick={handleConfirmRenameBreed}
                    disabled={isSaving}
                  >
                    {isSaving ? '處理中...' : '確認'}
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
          <div className="flex justify-end mt-4">
            <button
              className="px-6 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600 disabled:opacity-50"
              onClick={handleSavePetIntroduction}
              disabled={isSaving}
            >
              {isSaving ? '儲存中...' : '儲存寵物介紹'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
