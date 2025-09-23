'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import TypeformResponses from '@/components/TypeformResponses';
import ScoreSettings from '@/components/ScoreSettings';
import ProductRecommendations from '@/components/ProductRecommendations';
import PetIntroductions from '@/components/PetIntroductions';
import ApiTester from '@/components/ApiTester';
import { useEffect, useState } from 'react';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // 頁籤狀態
  const [mainTab, setMainTab] = useState('responses');
  
  // API測試狀態
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
      "波斯貓": {
        description: "波斯貓擁有長而柔軟的毛髮和扁平的臉部特徵，需要特別的護理。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動，避免因長毛影響活動能力。",
          "皮毛與皮膚狀況": "長毛需要每日梳理，預防毛球和皮膚問題。",
          "心血管功能與耐力表現": "扁平臉部可能影響呼吸，需要特別注意。",
          "情緒穩定與壓力管理": "性格溫和但較為敏感，需要穩定的環境。",
          "視覺健康與退化性疾病": "扁平臉部容易有淚痕問題，需要定期清潔。"
        }
      },
      "加菲貓（異國短毛）": {
        description: "加菲貓（異國短毛貓）結合了波斯貓的外觀和短毛的便利性。",
        healthItems: {
          "關節與肢體結構發展": "體型較為圓潤，需要注意關節健康。",
          "皮毛與皮膚狀況": "短毛易於護理，但仍需要定期梳理。",
          "心血管功能與耐力表現": "需要適度運動維持健康體態。",
          "情緒穩定與壓力管理": "性格溫和，適應性良好。",
          "視覺健康與退化性疾病": "扁平臉部特徵，需要特別注意眼部護理。"
        }
      },
      "孟加拉貓": {
        description: "孟加拉貓具有野性的外觀和活潑的性格，需要大量的運動空間。",
        healthItems: {
          "關節與肢體結構發展": "肌肉發達，需要大量運動維持關節靈活性。",
          "皮毛與皮膚狀況": "短毛易於護理，毛色斑紋需要特別保護。",
          "心血管功能與耐力表現": "高能量品種，需要充足的運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格活潑好動，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性眼部問題。"
        }
      },
      "緬因貓": {
        description: "緬因貓是大型長毛貓，性格溫和友善，被稱為「溫柔的巨人」。",
        healthItems: {
          "關節與肢體結構發展": "大型貓種，需要特別注意關節和骨骼健康。",
          "皮毛與皮膚狀況": "長毛需要每日梳理，預防毛球和皮膚問題。",
          "心血管功能與耐力表現": "大型體型需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格溫和友善，適應性良好。",
          "視覺健康與退化性疾病": "需要定期檢查，預防大型貓常見的健康問題。"
        }
      },
      "挪威森林貓": {
        description: "挪威森林貓擁有厚實的雙層毛髮，適應寒冷氣候，性格獨立。",
        healthItems: {
          "關節與肢體結構發展": "體型較大，需要適度運動維持關節健康。",
          "皮毛與皮膚狀況": "雙層毛髮需要特別護理，預防毛球問題。",
          "心血管功能與耐力表現": "需要適度運動維持健康體態。",
          "情緒穩定與壓力管理": "性格獨立，需要尊重其空間需求。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性健康問題。"
        }
      },
      "喜馬拉雅貓": {
        description: "喜馬拉雅貓結合了波斯貓和暹羅貓的特徵，擁有重點色毛色。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動，避免過度肥胖。",
          "皮毛與皮膚狀況": "長毛需要每日梳理，重點色需要特別保護。",
          "心血管功能與耐力表現": "需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格溫和，適應性良好。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性眼部疾病。"
        }
      },
      "暹羅貓": {
        description: "暹羅貓擁有優雅的體型和重點色毛色，性格活潑好動。",
        healthItems: {
          "關節與肢體結構發展": "體型優雅，需要適度運動維持關節靈活性。",
          "皮毛與皮膚狀況": "短毛易於護理，重點色需要特別保護。",
          "心血管功能與耐力表現": "活潑好動，需要充足運動維持健康。",
          "情緒穩定與壓力管理": "性格活潑，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性眼部問題。"
        }
      },
      "阿比西尼亞貓": {
        description: "阿比西尼亞貓擁有獨特的斑紋毛色和活潑的性格。",
        healthItems: {
          "關節與肢體結構發展": "體型優雅，需要適度運動維持關節健康。",
          "皮毛與皮膚狀況": "短毛易於護理，斑紋毛色需要特別保護。",
          "心血管功能與耐力表現": "活潑好動，需要充足運動維持健康。",
          "情緒穩定與壓力管理": "性格活潑，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性健康問題。"
        }
      },
      "無毛貓": {
        description: "無毛貓（斯芬克斯）沒有毛髮，需要特別的護理和保暖。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動，注意保暖以保護關節。",
          "皮毛與皮膚狀況": "無毛需要特別護理，防止皮膚乾燥和曬傷。",
          "心血管功能與耐力表現": "需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格溫和，需要穩定的環境溫度。",
          "視覺健康與退化性疾病": "需要定期檢查，預防眼部疾病。"
        }
      },
      "曼赤肯": {
        description: "曼赤肯（矮腳貓）擁有短腿特徵，性格活潑可愛。",
        healthItems: {
          "關節與肢體結構發展": "短腿特徵需要特別注意關節健康，避免過度跳躍。",
          "皮毛與皮膚狀況": "需要根據毛長進行適當護理。",
          "心血管功能與耐力表現": "需要適度運動，但要注意運動強度。",
          "情緒穩定與壓力管理": "性格活潑可愛，適應性良好。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性健康問題。"
        }
      },
      "金吉拉": {
        description: "金吉拉擁有銀色的長毛和優雅的氣質，需要細心護理。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動維持關節健康。",
          "皮毛與皮膚狀況": "長毛需要每日梳理，銀色毛髮需要特別保護。",
          "心血管功能與耐力表現": "需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格優雅，需要穩定的環境。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性眼部疾病。"
        }
      }
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
      "貴賓犬": {
        description: "貴賓犬聰明活潑，毛髮捲曲，需要定期美容護理。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動維持關節靈活性。",
          "皮毛與皮膚狀況": "捲毛需要定期美容和梳理，預防毛球問題。",
          "心血管功能與耐力表現": "活潑好動，需要充足運動維持健康。",
          "情緒穩定與壓力管理": "聰明敏感，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性眼部問題。"
        }
      },
      "馬爾濟斯": {
        description: "馬爾濟斯體型小巧，毛髮長而柔軟，性格溫和友善。",
        healthItems: {
          "關節與肢體結構發展": "小型犬需要適度運動，避免過度跳躍。",
          "皮毛與皮膚狀況": "長毛需要每日梳理，預防毛球和皮膚問題。",
          "心血管功能與耐力表現": "需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格溫和，適應性良好。",
          "視覺健康與退化性疾病": "需要定期檢查，預防小型犬常見健康問題。"
        }
      },
      "柴犬": {
        description: "柴犬是日本原生犬種，性格獨立堅強，需要適當的訓練。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動維持關節健康。",
          "皮毛與皮膚狀況": "雙層毛髮需要定期梳理，換毛期需要特別護理。",
          "心血管功能與耐力表現": "需要適度運動維持健康體態。",
          "情緒穩定與壓力管理": "性格獨立，需要適當的社會化訓練。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性健康問題。"
        }
      },
      "博美犬": {
        description: "博美犬體型小巧，毛髮蓬鬆，性格活潑好動。",
        healthItems: {
          "關節與肢體結構發展": "小型犬需要適度運動，避免過度跳躍。",
          "皮毛與皮膚狀況": "蓬鬆毛髮需要每日梳理，預防毛球問題。",
          "心血管功能與耐力表現": "活潑好動，需要充足運動維持健康。",
          "情緒穩定與壓力管理": "性格活潑，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防小型犬常見問題。"
        }
      },
      "黃金獵犬": {
        description: "黃金獵犬性格溫和友善，是理想的家庭伴侶犬。",
        healthItems: {
          "關節與肢體結構發展": "大型犬需要特別注意關節和骨骼健康。",
          "皮毛與皮膚狀況": "長毛需要定期梳理，預防毛球和皮膚問題。",
          "心血管功能與耐力表現": "需要充足運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格溫和友善，適應性良好。",
          "視覺健康與退化性疾病": "需要定期檢查，預防大型犬常見健康問題。"
        }
      },
      "拉布拉多": {
        description: "拉布拉多性格友善活潑，是優秀的工作犬和家庭伴侶。",
        healthItems: {
          "關節與肢體結構發展": "大型犬需要特別注意關節健康，避免過度肥胖。",
          "皮毛與皮膚狀況": "短毛易於護理，但仍需要定期梳理。",
          "心血管功能與耐力表現": "需要充足運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格友善活潑，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防大型犬常見問題。"
        }
      },
      "柯基犬": {
        description: "柯基犬擁有短腿特徵和活潑的性格，需要適度運動。",
        healthItems: {
          "關節與肢體結構發展": "短腿特徵需要特別注意關節健康，避免過度跳躍。",
          "皮毛與皮膚狀況": "雙層毛髮需要定期梳理，換毛期需要特別護理。",
          "心血管功能與耐力表現": "需要適度運動，但要注意運動強度。",
          "情緒穩定與壓力管理": "性格活潑，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性健康問題。"
        }
      },
      "臘腸犬": {
        description: "臘腸犬擁有長身短腿的特徵，需要特別注意脊椎健康。",
        healthItems: {
          "關節與肢體結構發展": "長身短腿特徵需要特別注意脊椎和關節健康。",
          "皮毛與皮膚狀況": "需要根據毛長進行適當護理。",
          "心血管功能與耐力表現": "需要適度運動，但要注意運動強度。",
          "情緒穩定與壓力管理": "性格活潑，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防脊椎相關問題。"
        }
      },
      "約克夏": {
        description: "約克夏體型小巧，毛髮長而柔軟，性格活潑好動。",
        healthItems: {
          "關節與肢體結構發展": "小型犬需要適度運動，避免過度跳躍。",
          "皮毛與皮膚狀況": "長毛需要每日梳理，預防毛球和皮膚問題。",
          "心血管功能與耐力表現": "活潑好動，需要充足運動維持健康。",
          "情緒穩定與壓力管理": "性格活潑，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防小型犬常見問題。"
        }
      },
      "雪納瑞": {
        description: "雪納瑞擁有獨特的鬍鬚和眉毛，性格活潑好動。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動維持關節健康。",
          "皮毛與皮膚狀況": "需要定期美容和梳理，鬍鬚需要特別護理。",
          "心血管功能與耐力表現": "活潑好動，需要充足運動維持健康。",
          "情緒穩定與壓力管理": "性格活潑，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性健康問題。"
        }
      },
      "法國鬥牛犬": {
        description: "法國鬥牛犬體型緊湊，臉部扁平，需要特別的護理。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動，避免過度肥胖。",
          "皮毛與皮膚狀況": "短毛易於護理，但需要特別注意皮膚皺褶。",
          "心血管功能與耐力表現": "扁平臉部可能影響呼吸，需要特別注意。",
          "情緒穩定與壓力管理": "性格溫和，適應性良好。",
          "視覺健康與退化性疾病": "需要定期檢查，預防扁平臉部相關問題。"
        }
      },
      "西施犬": {
        description: "西施犬擁有長而柔軟的毛髮和友善的性格。",
        healthItems: {
          "關節與肢體結構發展": "小型犬需要適度運動，避免過度跳躍。",
          "皮毛與皮膚狀況": "長毛需要每日梳理，預防毛球和皮膚問題。",
          "心血管功能與耐力表現": "需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格友善，適應性良好。",
          "視覺健康與退化性疾病": "需要定期檢查，預防小型犬常見問題。"
        }
      },
      "巴哥犬": {
        description: "巴哥犬擁有扁平的臉部和皺褶皮膚，需要特別的護理。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動，避免過度肥胖。",
          "皮毛與皮膚狀況": "皺褶皮膚需要特別清潔，預防皮膚感染。",
          "心血管功能與耐力表現": "扁平臉部可能影響呼吸，需要特別注意。",
          "情緒穩定與壓力管理": "性格溫和，適應性良好。",
          "視覺健康與退化性疾病": "需要定期檢查，預防扁平臉部相關問題。"
        }
      },
      "比熊犬": {
        description: "比熊犬擁有蓬鬆的白色毛髮和活潑的性格。",
        healthItems: {
          "關節與肢體結構發展": "小型犬需要適度運動，避免過度跳躍。",
          "皮毛與皮膚狀況": "蓬鬆毛髮需要每日梳理，白色毛髮需要特別保護。",
          "心血管功能與耐力表現": "活潑好動，需要充足運動維持健康。",
          "情緒穩定與壓力管理": "性格活潑，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防小型犬常見問題。"
        }
      },
      "哈士奇": {
        description: "哈士奇擁有厚實的雙層毛髮和活潑好動的性格。",
        healthItems: {
          "關節與肢體結構發展": "需要大量運動維持關節健康。",
          "皮毛與皮膚狀況": "雙層毛髮需要定期梳理，換毛期需要特別護理。",
          "心血管功能與耐力表現": "高能量品種，需要充足運動維持健康。",
          "情緒穩定與壓力管理": "性格活潑好動，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性健康問題。"
        }
      },
      "邊境牧羊犬": {
        description: "邊境牧羊犬是聰明的工作犬，需要大量的運動和智力刺激。",
        healthItems: {
          "關節與肢體結構發展": "需要大量運動維持關節健康。",
          "皮毛與皮膚狀況": "需要定期梳理，預防毛球問題。",
          "心血管功能與耐力表現": "高能量品種，需要充足運動維持健康。",
          "情緒穩定與壓力管理": "聰明活潑，需要豐富的環境刺激和訓練。",
          "視覺健康與退化性疾病": "需要定期檢查，預防工作犬常見問題。"
        }
      },
      "吉娃娃": {
        description: "吉娃娃是體型最小的犬種，性格勇敢但需要細心護理。",
        healthItems: {
          "關節與肢體結構發展": "超小型犬需要特別注意關節健康，避免過度跳躍。",
          "皮毛與皮膚狀況": "需要根據毛長進行適當護理。",
          "心血管功能與耐力表現": "需要適度運動，但要注意運動強度。",
          "情緒穩定與壓力管理": "性格勇敢但敏感，需要穩定的環境。",
          "視覺健康與退化性疾病": "需要定期檢查，預防超小型犬常見問題。"
        }
      },
      "杜賓犬": {
        description: "杜賓犬是大型工作犬，性格忠誠勇敢，需要適當的訓練。",
        healthItems: {
          "關節與肢體結構發展": "大型犬需要特別注意關節和骨骼健康。",
          "皮毛與皮膚狀況": "短毛易於護理，但仍需要定期梳理。",
          "心血管功能與耐力表現": "需要充足運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格忠誠勇敢，需要適當的社會化訓練。",
          "視覺健康與退化性疾病": "需要定期檢查，預防大型犬常見問題。"
        }
      },
      "大麥町": {
        description: "大麥町擁有獨特的斑點毛色和活潑的性格。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動維持關節健康。",
          "皮毛與皮膚狀況": "短毛易於護理，斑點毛色需要特別保護。",
          "心血管功能與耐力表現": "活潑好動，需要充足運動維持健康。",
          "情緒穩定與壓力管理": "性格活潑，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性健康問題。"
        }
      },
      "薩摩耶": {
        description: "薩摩耶擁有厚實的白色毛髮和友善的性格。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動維持關節健康。",
          "皮毛與皮膚狀況": "厚實毛髮需要每日梳理，白色毛髮需要特別保護。",
          "心血管功能與耐力表現": "需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格友善，適應性良好。",
          "視覺健康與退化性疾病": "需要定期檢查，預防大型犬常見問題。"
        }
      },
      "喜樂蒂牧羊犬": {
        description: "喜樂蒂牧羊犬是聰明的工作犬，需要適當的運動和訓練。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動維持關節健康。",
          "皮毛與皮膚狀況": "長毛需要定期梳理，預防毛球問題。",
          "心血管功能與耐力表現": "需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "聰明活潑，需要豐富的環境刺激和訓練。",
          "視覺健康與退化性疾病": "需要定期檢查，預防工作犬常見問題。"
        }
      },
      "阿拉斯加雪橇犬": {
        description: "阿拉斯加雪橇犬是大型工作犬，擁有厚實的毛髮和強健的體魄。",
        healthItems: {
          "關節與肢體結構發展": "大型犬需要特別注意關節和骨骼健康。",
          "皮毛與皮膚狀況": "厚實毛髮需要每日梳理，換毛期需要特別護理。",
          "心血管功能與耐力表現": "需要大量運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格友善但需要大量運動和空間。",
          "視覺健康與退化性疾病": "需要定期檢查，預防大型犬常見問題。"
        }
      },
      "比特犬": {
        description: "比特犬是強壯的犬種，需要適當的訓練和社會化。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動維持關節健康。",
          "皮毛與皮膚狀況": "短毛易於護理，但仍需要定期梳理。",
          "心血管功能與耐力表現": "需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "需要適當的社會化訓練和穩定的環境。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性健康問題。"
        }
      },
      "牛頭梗": {
        description: "牛頭梗擁有獨特的外觀和活潑的性格。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動維持關節健康。",
          "皮毛與皮膚狀況": "短毛易於護理，但仍需要定期梳理。",
          "心血管功能與耐力表現": "活潑好動，需要充足運動維持健康。",
          "情緒穩定與壓力管理": "性格活潑，需要豐富的環境刺激。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性健康問題。"
        }
      },
      "惡霸犬": {
        description: "惡霸犬是強壯的犬種，需要適當的訓練和社會化。",
        healthItems: {
          "關節與肢體結構發展": "需要適度運動維持關節健康。",
          "皮毛與皮膚狀況": "短毛易於護理，但仍需要定期梳理。",
          "心血管功能與耐力表現": "需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "需要適當的社會化訓練和穩定的環境。",
          "視覺健康與退化性疾病": "需要定期檢查，預防遺傳性健康問題。"
        }
      },
      "聖伯納犬": {
        description: "聖伯納犬是大型救援犬，性格溫和友善。",
        healthItems: {
          "關節與肢體結構發展": "大型犬需要特別注意關節和骨骼健康。",
          "皮毛與皮膚狀況": "需要定期梳理，預防毛球和皮膚問題。",
          "心血管功能與耐力表現": "需要適度運動維持心血管健康。",
          "情緒穩定與壓力管理": "性格溫和友善，適應性良好。",
          "視覺健康與退化性疾病": "需要定期檢查，預防大型犬常見問題。"
        }
      },
      "德國牧羊犬": {
        description: "德國牧羊犬是優秀的工作犬，聰明忠誠，需要適當的訓練。",
        healthItems: {
          "關節與肢體結構發展": "大型犬需要特別注意關節和骨骼健康。",
          "皮毛與皮膚狀況": "需要定期梳理，預防毛球問題。",
          "心血管功能與耐力表現": "需要充足運動維持心血管健康。",
          "情緒穩定與壓力管理": "聰明忠誠，需要豐富的環境刺激和訓練。",
          "視覺健康與退化性疾病": "需要定期檢查，預防工作犬常見問題。"
        }
      }
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

  // 推薦商品狀態 { 0: { products: [], note: '', selectedItem: '', ingredients: '', formula: '' }, 1: { ... }, ... }
  const [recommendations, setRecommendations] = useState(
    Array.from({ length: 11 }, (_, i) => i).reduce((acc, score) => {
      acc[score] = { products: [], note: '', selectedItem: '', ingredients: '', formula: '' };
      return acc;
    }, {})
  );

  // 新增：推薦商品九大項選擇
  const [selectedRecommendItem, setSelectedRecommendItem] = useState('');
  // 推薦商品暫存資料 { [item]: { 0: { products: [], note: '', productInput: '', description: '', ingredients: '', formula: '' }, ...10 } }
  const [recommendCache, setRecommendCache] = useState({});

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

  // 寵物健康項目（固定項目）
  const petHealthItems = [
    "關節與肢體結構發展",
    "皮毛與皮膚狀況", 
    "心血管功能與耐力表現",
    "情緒穩定與壓力管理",
    "視覺健康與退化性疾病"
  ];

  // Typeform 問題權重暫存資料 - 整合到 answerWeights 中
  const [answerWeights, setAnswerWeights] = useState({
    // OCx06HNqyfRR: 汪星人的年齡？
    "OCx06HNqyfRR": {
      "adaMMgQ3fX5S": { 腸胃: 0.5, 關節: 0.5 }, // 幼年期 (Puppy) 0–1歲
      "2IaNT2GvJaJb": {}, // 成年期 (Adult) 1–5歲
      "Fn2DaBphk5Sw": { 腸胃: 0.5, 關節: 0.5 }, // 中年期 (Mature) 6–8歲
      "Kd5iKQLGPHaL": { 腸胃: 1, 關節: 0.5, 心血管: 1 }, // 高齡期 (Senior) 9–11歲
      "47ko9YQ9Yyz9": { 關節: 0.5 } // 超高齡期 (Geriatric) 12歲以上
    },
    // SCSofQklMIXT: 喵星人的年齡？
    "SCSofQklMIXT": {
      "UkhzVUNnom8B": { 腸胃: 0.5, 關節: 0.5 }, // 幼貓期 (Kitten) 0–6個月
      "kprrRnqY5Vzs": { 關節: 0.5 }, // 少年期 (Junior) 7個月–2歲
      "ThosSaaZuUma": {}, // 成年期 (Adult) 3–6歲
      "CpAjOAXCddJV": { 腸胃: 0.5, 關節: 0.5 }, // 中年期 (Mature) 7–10歲
      "mMjLLjIcYTLf": { 腸胃: 1, 關節: 0.5, 心血管: 1 }, // 高齡期 (Senior) 11–14歲
      "ABSo6J9HszJh": {} // 超高齡期 (Geriatric) 15歲以上
    },
    // GI8YbuaWP81M: 您覺得寶貝的目前的體態狀況如何呢？
    "GI8YbuaWP81M": {
      "5XgF6JlEAnQn": { 腸胃: 1, 體重: 0.5 }, // 過瘦（肋骨明顯、缺乏脂肪）
      "ly2SpwM1p4BJ": { 腸胃: 0.5 }, // 偏瘦（比理想體態略瘦一點）
      "quvu6MJeqAKp": {}, // 正常（體態勻稱、活動自如）
      "UITkWQnZtcFK": { 體重: 0.5, 關節: 0.5, 心血管: 0.5 }, // 偏胖（肚子稍圓、走路沉重）
      "afjFZ8yt6TXI": { 體重: 1, 關節: 1, 心血管: 1 } // 過胖（肚子明顯突出、活動力下降）
    },
    // 88gYqTMhGMYt: 寶貝是否已結紮
    "88gYqTMhGMYt": {
      "3Gnyce6aS6jm": { 體重: 1, 情緒: 0.5, 免疫: 1 }, // 已結紮
      "7JfAXMaGDvjU": { 體重: 0.5, 免疫: 1, 情緒: 0.5 } // 未結紮
    },
    // tY25d8xW6avl: 汪星人平常的居住環境
    "tY25d8xW6avl": {
      "rJC1DJi58vSV": { 情緒: 1, 免疫: 1, 體重: 1 }, // 完全室內
      "jOJSVonvul2F": { 體重: 0.5, 免疫: 0.5, 體重: 1 }, // 室內為主，偶爾外出
      "G42RwCUdbwRu": { 情緒: 1, 免疫: 0.5, 皮毛: 0.5 }, // 半戶外（陽台/院子）
      "jt3fkX6JTnr4": { 情緒: 1, 免疫: 1 } // 完全戶外
    },
    // AchHFVv83TGg: 喵星人平常的居住環境
    "AchHFVv83TGg": {
      "8Rf8pC5cHkF5": { 情緒: 1, 免疫: 1, 體重: 1 }, // 理想環境：室內空間寬敞、通風良好、有日照、環境安靜，有跳台與豐富刺激（玩具、攀爬區等）
      "JfJSRQCqW5Vi": { 體重: 0.5, 免疫: 0.5, 體重: 1 }, // 一般室內：室內空間中等，有日照與通風但缺乏豐富刺激（如少玩具或無跳台
      "sLAkWM6c48X9": { 情緒: 1, 免疫: 0.5, 皮毛: 0.5 }, // 壓力環境：空間狹小或環境吵雜（如家中有幼童、噪音多、頻繁被打擾）
      "y8z58cmthAhB": { 皮毛: 0.5 }, // 潮濕陰暗環境：通風不良、日照不足、濕氣重、空氣品質差
      "tHPSTwA34N2X": { 情緒: 1, 免疫: 1 } // 半戶外自由活動：有窗台/陽台/庭院自由活動空間，活動豐富但有病原風險
    },
    // mk6h7aF3rC00: 室內環境中是否使用冷氣
    "mk6h7aF3rC00": {
      "bdyF2jS5ZsWo": { 皮毛: 0.5 }, // 經常，幾乎全天候
      "eaUgvvkv524G": { 皮毛: 1 }, // 部分時間，例如夏季高溫時
      "JB9cqDMKJmaV": { 皮毛: 1 } // 很少或從不使用冷氣
    },
    // 1UzCL5ETzB5H: 您想為寶貝保健的方向（可複選）
    "1UzCL5ETzB5H": {
      "jMYe5GBARt1X": { 腸胃: 1 }, // 腸胃保健
      "tIau2JJ4RpHF": { 關節: 1 }, // 關節保健
      "6yl6IFFCAlvG": { 泌尿: 1 }, // 泌尿保健
      "jptjSeSKlfv4": { 皮毛: 1 }, // 皮毛保健
      "RKxGfqxfG8v3": { 情緒: 1 }, // 情緒穩定
      "IM0klsuRoJtO": { 體重: 1 }, // 體重管理
      "cq3CJ6v7WnqP": { 心血管: 1 }, // 心血管保健
      "5RyipJFpirpU": { 眼睛: 1 }, // 眼睛保健
      "KaaCibx6C25g": { 免疫: 1 }, // 免疫支持
      "1x9N3FB1NACp": {} // 不確定，想依AI系統推薦
    },
    // nlq7BhnfT0ku: 寶貝是否會出現吃太快、吐食或反芻的狀況？
    "nlq7BhnfT0ku": {
      "W1pIwpMv9lIC": {}, // 沒有
      "xWDqurGuCy3z": { 腸胃: 0.5 }, // 偶爾發生
      "EeqMsmHDL9Qa": { 腸胃: 1 } // 經常發生
    },
    // wEdniu8bfauh: 寶貝是否常有脹氣、放屁、打嗝等消化不良狀況？
    "wEdniu8bfauh": {
      "Y5P2IDN5MYZy": {}, // 幾乎沒有
      "SFQwJlV12YZC": { 腸胃: 0.5 }, // 偶爾會
      "BiV5sFAW3IK4": { 腸胃: 1 } // 經常發生，且影響活動
    },
    // 89WHqMK74Inu: 寶貝的排便情況是否正常？
    "89WHqMK74Inu": {
      "4TXl83a6tk0q": {}, // 很規律、成形漂亮
      "3BuytdNtNkmW": { 腸胃: 0.5 }, // 偶爾軟便或便秘
      "qfrxFdLyM5cQ": { 腸胃: 1 } // 經常軟便、便秘或排便異常
    },
    // QeyXYG84fBAJ: 寶貝在休息後剛起身時是否顯得僵硬或慢動作？
    "QeyXYG84fBAJ": {
      "uJI46vXQkvJE": {}, // 起身迅速
      "t4r9ExWIMh7U": { 關節: 0.5 }, // 偶爾顯得卡卡的
      "8ZFbQuryuRRa": { 關節: 1 } // 常常剛起身很僵硬
    },
    // 91OSxmpo85Uj: 寶貝在日常走路時是否會出現跛腳、僵硬或異常步態？
    "91OSxmpo85Uj": {
      "is20JbZsOAf8": {}, // 步態正常
      "QbIfTufuVRoD": { 關節: 0.5 }, // 偶爾步伐怪異
      "yVxJtp60FPGo": { 關節: 1 } // 常常步伐不順、有跛腳情況
    },
    // 5mchUhmMmXM7: 寶貝在跑動、上下樓梯、跳上沙發或床時是否吃力？
    "5mchUhmMmXM7": {
      "I2vq2Erh7KdH": {}, // 很靈活、毫無問題
      "83S2BDOSYmzZ": { 關節: 0.5 }, // 有點吃力或有時不願跳
      "LbbKVcMf0jlI": { 關節: 1 } // 很明顯吃力或完全不跳躍
    },
    // s1KOSBz6vdnO: 寶貝是否有頻尿、少量多次或憋尿情況？
    "s1KOSBz6vdnO": {
      "cjgltfKcIxNz": {}, // 排尿正常
      "2TN8lSe3zBt3": { 泌尿: 0.5 }, // 偶爾頻尿或憋尿
      "4Umh3zgiQua7": { 泌尿: 1 } // 經常頻尿或排尿異常
    },
    // PtdgJjgNpdtB: 寶貝排尿時是否有表現出掙扎、不舒服或呻吟？
    "PtdgJjgNpdtB": {
      "HneX2XmbpQWv": {}, // 沒有異常行為
      "8w5fEjwf68IY": { 泌尿: 0.5 }, // 偶爾出現不舒服表情
      "zKXXNRWdObK1": { 泌尿: 1 } // 排尿時常明顯不適
    },
    // sO4FEv98o185: 寶貝的尿液是否曾有異常氣味、顏色混濁或含血？
    "sO4FEv98o185": {
      "57ahifVZmuzP": {}, // 尿液正常
      "vz5uAJdwQM9g": { 泌尿: 1 }, // 曾出現異常氣味/顏色
      "NSDBgU6tWFnP": { 泌尿: 2 } // 經常混濁、有血、臭味重
    },
    // 4zzJeQugKs4U: 寶貝是否有明顯掉毛、毛髮粗糙或稀疏？
    "4zzJeQugKs4U": {
      "hRHAaPsQ7619": {}, // 毛髮柔順且濃密
      "26KsSa2zKbiM": { 皮毛: 0.5 }, // 有些毛粗或毛量減少
      "BfL3xPTRF4aG": { 皮毛: 1 } // 掉毛嚴重或毛髮稀疏乾燥
    },
    // 1qvmwgeRsX7i: 是否經常看到寶貝抓癢、舔毛或咬皮膚？
    "1qvmwgeRsX7i": {
      "J5u1DQBoW2Q9": {}, // 幾乎不會
      "lWnfgVT9Y8fZ": { 皮毛: 0.5 }, // 偶爾抓癢或舔毛
      "yMCsuKuwkhl9": { 皮毛: 1 } // 經常抓癢或舔毛到脫毛
    },
    // i7lGuJjpCk2U: 是否曾出現紅疹、皮屑、異味或皮膚異常？
    "i7lGuJjpCk2U": {
      "oHHUtgyv2PZW": {}, // 皮膚乾淨無異常
      "hLjx2qICRfUq": { 皮毛: 0.5 }, // 偶爾有皮屑或異味
      "xgwHuf5Mmyj6": { 皮毛: 1 } // 經常出現紅疹、皮屑、皮膚問題
    },
    // TZRZLsJRKZgg: 寶貝在獨處時，是否容易出現不安或異常行為？
    "TZRZLsJRKZgg": {
      "XKTZ0xJFtAZ2": {}, // 獨處時非常穩定
      "qu1cStPZlYis": { 情緒: 0.5 }, // 偶爾不安
      "oY9zLeFNFGTo": { 情緒: 1 } // 獨處常焦躁、出現異常行為
    },
    // 4r6iyfQo5UYK: 寶貝是否對新環境、搬家或陌生空間容易緊張、不安或不願探索？
    "4r6iyfQo5UYK": {
      "XmfzkhctLs6k": {}, // 非常適應環境，情緒穩定
      "6bag6wd3RUdh": { 情緒: 0.5 }, // 適應力普通，有些焦躁
      "8GCWYZNBwcvj": { 情緒: 1 } // 常緊張、戒備心強、不易放鬆
    },
    // J9vSx76ASdKP: 寶貝是否對聲音特別敏感？
    "J9vSx76ASdKP": {
      "jaebiZl9jPga": {}, // 非常鎮定、不怕聲音
      "ygxL2O37T3Tl": { 情緒: 0.5 }, // 偶爾受驚但可平復
      "5kuZpDbf2qwr": { 情緒: 1 } // 對聲音非常敏感、情緒激動
    },
    // W9tDwUbMLPzN: 寶貝的體型是否已影響日常活動？
    "W9tDwUbMLPzN": {
      "AXYsiBEfLAjB": {}, // 無影響
      "HdyCTYpt0Ar1": { 體重: 0.5 }, // 輕微影響
      "zJn2sBivn8Gj": { 體重: 1 } // 明顯影響日常行為
    },
    // lHfNIJcjtG2n: 寶貝的食慾是否異常（暴食、挑食或食量變化大）？
    "lHfNIJcjtG2n": {
      "9tqr0aTD5LGc": {}, // 食慾穩定
      "ibjxpvyQKa7g": { 腸胃: 0.5 }, // 偶爾暴食或挑食
      "ktV32pcNCtCI": { 腸胃: 1 } // 常有食慾異常或進食行為怪異
    },
    // 33Bpbj6NvPG6: 寶貝的體重變化是否穩定？
    "33Bpbj6NvPG6": {
      "YTpO4KVllmG7": {}, // 體重穩定
      "7lCAQaXkurvC": { 體重: 0.5 }, // 偶爾有輕微變化
      "eo3ikHjcqfPj": { 體重: 1 } // 經常波動大
    },
    // Z8dsIrgYXAzH: 寶貝是否在日常生活中變得不愛活動？
    "Z8dsIrgYXAzH": {
      "E6o9n6OXUTYH": {}, // 平常活動力正常
      "LySivMb8i5my": { 關節: 0.5 }, // 偶爾會顯得懶洋洋，但持續時間不長
      "T0b0fxVSKGlb": { 關節: 1 } // 經常懶洋洋，幾乎不主動活動
    },
    // 1TVDYuk0jGar: 寶貝在短時間運動後是否表現出疲憊或呼吸急促？
    "1TVDYuk0jGar": {
      "5TjioH6UvZrU": {}, // 運動後恢復快，幾乎沒有疲憊表現
      "sVUJmaXYtXlC": { 心血管: 0.5 }, // 偶爾感覺較疲憊，但可以很快恢復
      "gaMxOnwLbapp": { 心血管: 1 } // 經常運動後喘息明顯，需要長時間休息
    },
    // 3rdB1Dc8C2Mb: 寶貝是否曾有喘息、咳嗽或夜間呼吸不規律的情況？
    "3rdB1Dc8C2Mb": {
      "huW9CckamUPt": { 心血管: 1 }, // 沒有出現過
      "YeTNYgEq6OAk": { 心血管: 1 }, // 偶爾有，但時間短
      "oSgXk4nhDl7c": { 心血管: 2 } // 經常出現且持續時間長
    },
    // cV6GYtzBETmh: 寶貝是否經常眨眼或揉眼睛？
    "cV6GYtzBETmh": {
      "fpZeYIgom3RO": {}, // 很少或沒有
      "6sQgbWtx51xI": { 眼睛: 0.5 }, // 偶爾出現
      "8FUVuMPzATEh": { 眼睛: 1 } // 經常出現
    },
    // NA30VERyt14J: 寶貝是否在強光下顯得不適，或在低光環境下行動異常？
    "NA30VERyt14J": {
      "4admwK5yWzqk": {}, // 完全正常
      "JP59l3BPB4Bi": { 眼睛: 0.5 }, // 偶爾有不適反應
      "TiBoFbwBVdjW": { 眼睛: 1 } // 經常表現出不適
    },
    // GVvU76rBGIYd: 是否發現眼睛分泌物增加、眼白變紅或眼睛混濁的情況？
    "GVvU76rBGIYd": {
      "Ln3qGBJV46Dg": { 眼睛: 1 }, // 沒有異常
      "epXjoP8LuE0t": { 眼睛: 1 }, // 偶爾出現異常
      "hemQrpFULCJz": { 眼睛: 2 } // 經常有明顯異常
    },
    // TstMewOzQrWZ: 寶貝是否容易生病、反覆感染或體質虛弱？
    "TstMewOzQrWZ": {
      "6PDC598Fz1cH": { 免疫: 0.5 }, // 幾乎不生病
      "i9j5VNmz5VKs": { 免疫: 1 }, // 偶爾小病，但恢復迅速
      "eMxruFyCUWFk": { 免疫: 2 } // 經常生病且恢復較慢
    },
    // 9kMQcoK7eVO4: 寶貝是否容易出現過敏反應（如皮膚紅疹、打噴嚏、流鼻水）？
    "9kMQcoK7eVO4": {
      "NMPWWpDZ7hll": { 免疫: 1 }, // 沒有明顯過敏症狀
      "o31smP59VbDG": { 免疫: 1 }, // 偶爾有輕微過敏
      "DEBxjToOwECh": { 免疫: 2 } // 經常出現明顯過敏反應
    },
    // HFkk2DCJqMXK: 寶貝是否曾出現過長時間恢復的疾病症狀，或是否對普通感染恢復較慢？
    "HFkk2DCJqMXK": {
      "c4NS2It2jp8V": { 免疫: 1 }, // 沒有這樣的情況
      "SEmQxBiAsxU0": { 免疫: 1 }, // 偶爾恢復較慢，但影響不大
      "bYQrSiDNsgE0": { 免疫: 2 } // 經常恢復緩慢，並影響日常活動
    },
    // oiciZoATwsUl: 為了讓我們的 AI 系統提供更安全且貼近寶貝需求的保健建議，請勾選寶貝是否已有已知的疾病。
    "oiciZoATwsUl": {
      "2ks2BzjYFd1J": {}, // 無
      "txMU23sM6MXn": { 腸胃: 1 }, // 腸胃道問題（如慢性腸胃炎、胰臟炎）
      "yJkzt6cN8YoZ": { 關節: 1, 體重: 0.5 }, // 關節疾病（如關節炎、退化性關節病）
      "PUgoUzxxEgJn": { 泌尿: 1, 體重: 0.5, 免疫: 0.5 }, // 慢性泌尿問題（如腎臟病、尿道結石）
      "XXPDvKXuLDXC": { 皮毛: 1, 免疫: 0.5 }, // 慢性皮膚病（如異位性皮膚炎）
      "aoLonmGG9qf1": { 情緒: 1 }, // 長期焦慮或情緒障礙（獸醫診斷）
      "tLO7Dwj1qfou": { 體重: 1, 關節: 0.5 }, // 體重代謝問題（如肥胖、糖尿病）
      "YuRt8kH7yN2W": { 心血管: 1, 體重: 0.5, 免疫: 0.5 }, // 心血管問題（如心雜音、心臟病）
      "iVVxPR18qae1": { 眼睛: 1 }, // 視力退化／眼疾（如白內障）
      "njDRrWCFhhUx": { 免疫: 0.5, 體重: 0.5 }, // 免疫相關問題（如氣喘、易感染體質）
      "iZdy3ZvT0vc0": {} // 其他
    },
    // uPYaYmDniYXi: 若寶貝曾經歷過手術或有特殊健康狀況，我們的 AI 系統將會嘗試標示為高關懷對象，並在未來進一步進行健康分析與提供建議。
    "uPYaYmDniYXi": {
      "EkL37uUb4ULA": {}, // 無
      "GpIS5vjtPswt": { 腸胃: 1 }, // 曾進行腸胃手術（如腸阻塞、胃扭轉等）
      "UxL1ktzLQbre": { 關節: 1 }, // 曾進行關節手術（如髖關節、十字韌帶重建等）
      "Lwyy3ZPCMElq": { 泌尿: 1 }, // 曾進行泌尿道手術（如膀胱結石、尿道阻塞等）
      "zOeRNZkx3fF0": { 皮毛: 1 }, // 曾因皮膚腫瘤／皮膚病接受開刀
      "xF39hPV1b0jK": { 情緒: 1 }, // 曾因行為或神經問題接受相關處置（如焦慮治療、癲癇控制等）
      "HnWjsaWQ67Iu": { 體重: 1 }, // 曾因肥胖引發的相關併發手術（如膝關節矯正、脂肪瘤切除）
      "dWdUmSTHD6tG": { 心血管: 1 }, // 曾接受心臟相關手術（如心導管、心臟瓣膜等）
      "OBRuPCgr1OI8": { 眼睛: 1 }, // 曾因眼疾進行眼科手術（如白內障、視網膜修補等）
      "MmV63Z3FsiBP": { 免疫: 1 }, // 曾因免疫問題接受特殊處理（如自體免疫疾病、腫瘤切除、免疫抑制治療）
      "6s9VDgizko7G": {} // 其他（不影響配方建議，僅供紀錄）
    }
  });

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
    const res = await fetch('/api/get-response/ugplskupcpikn8xvlougpl1f2vlqonr1');
    const data = await res.json();
    console.log('問卷詳細fetchResponse', data);
  };

  // 取得題目資料
  const fetchQuestions = async () => {
    const res = await fetch('/api/get-questions');
    const data = await res.json();
    console.log('fetchQuestions', data);
    setQuestions(data.fields || []);
  };

  useEffect(() => {
    fetchQuestions();
    fetchResponse();
    fetchProducts();
    fetchCustomers();
    
    fetchCustomers('34589990');
    testGetResponseBySession();
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

  async function testGetResponseBySession() {
    const sessionId = '06a3a57c-003e-4e2f-a149-3af09069af69';
    const res = await fetch(`/api/get-responses-by-session/${sessionId}`);
    const data = await res.json();
    console.log('session_id 測試結果:', data);
  }

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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <main className="min-h-screen bg-gray-100 p-6">
            {/* 頁籤切換 */}
            <div className="flex space-x-8 mb-8 border-b border-gray-300">
              <button
                className={`px-6 py-2 font-bold transition-colors duration-200 border-b-4 ${
                  mainTab === 'responses'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-blue-700'
                }`}
                onClick={() => setMainTab('responses')}
              >
                Typeform回覆資料
              </button>
              <button
                className={`px-6 py-2 font-bold transition-colors duration-200 border-b-4 ${
                  mainTab === 'weight'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-blue-700'
                }`}
                onClick={() => setMainTab('weight')}
              >
                設定分數
              </button>
              <button
                className={`px-6 py-2 font-bold transition-colors duration-200 border-b-4 ${
                  mainTab === 'recommend'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-blue-700'
                }`}
                onClick={() => setMainTab('recommend')}
              >
                推薦商品
              </button>
              <button
                className={`px-6 py-2 font-bold transition-colors duration-200 border-b-4 ${
                  mainTab === 'pet-intro'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-blue-700'
                }`}
                onClick={() => setMainTab('pet-intro')}
              >
                寵物介紹
              </button>
              <ApiTester />
            </div>

            {/* 內容區塊 */}
            {mainTab === 'responses' && (
              <TypeformResponses questions={questions} />
            )}

            {mainTab === 'weight' && (
              <ScoreSettings 
                questions={questions}
                answerWeights={answerWeights}
                setAnswerWeights={setAnswerWeights}
              />
            )}

            {mainTab === 'recommend' && (
              <ProductRecommendations />
            )}

            {mainTab === 'pet-intro' && (
              <PetIntroductions />
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
