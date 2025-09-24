import mongoose from 'mongoose';
import AnswerWeight from '@/models/AnswerWeight';

// 九大項分類
const healthCategories = [
  '腸胃', '關節', '泌尿', '皮毛', '情緒', '體重', '心血管', '眼睛', '免疫'
];

// 連接 MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 連接成功');
  } catch (error) {
    console.error('MongoDB 連接失敗:', error);
    throw error;
  }
}

// 從 MongoDB 獲取答案權重資料
export async function getAnswerWeights() {
  try {
    await connectDB();
    const answerWeights = await AnswerWeight.find({});
    
    // 轉換為物件格式，方便查找
    const weightsMap = {};
    answerWeights.forEach(item => {
      weightsMap[item.questionId] = {};
      item.answerWeights.forEach((weights, answerId) => {
        weightsMap[item.questionId][answerId] = {};
        weights.forEach((score, category) => {
          weightsMap[item.questionId][answerId][category] = score;
        });
      });
    });
    
    return weightsMap;
  } catch (error) {
    console.error('獲取答案權重資料失敗:', error);
    throw error;
  }
}

// 計算分數的函數
export function calculateScores(answers, answerWeights) {
  const scores = {
    腸胃: 0,
    關節: 0,
    泌尿: 0,
    皮毛: 0,
    情緒: 0,
    體重: 0,
    心血管: 0,
    眼睛: 0,
    免疫: 0
  };

  // 遍歷每個答案
  answers.forEach(answer => {
    const questionId = answer.field?.id;
    let answerIds = [];

    // 根據答案類型獲取答案ID
    if (answer.type === 'choice' && answer.choice?.id) {
      // 單選答案
      answerIds = [answer.choice.id];
    } else if (answer.type === 'choices' && answer.choices?.ids) {
      // 多選答案 - 使用choices.ids陣列
      answerIds = answer.choices.ids;
    } else if (answer.type === 'text' && answer.text) {
      // 對於text類型的答案，可能需要特殊處理
      // 這裡先跳過，因為暫存資料主要針對choice類型
      return;
    }

    // 處理每個答案ID
    answerIds.forEach(answerId => {
      // 如果找到對應的權重資料
      if (questionId && answerId && answerWeights[questionId] && answerWeights[questionId][answerId]) {
        const weights = answerWeights[questionId][answerId];
        
        // 累加各項分數
        Object.keys(weights).forEach(category => {
          if (scores.hasOwnProperty(category)) {
            scores[category] += weights[category];
          }
        });
      }
    });
  });

  return scores;
}

// 獲取最高分數的項目
export function getTopCategories(scores, limit = 4) {
  return Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([category, score]) => ({ category, score }));
}

// 完整的分數計算流程
export async function calculateHealthScores(answers) {
  try {
    const answerWeights = await getAnswerWeights();
    const scores = calculateScores(answers, answerWeights);
    const topCategories = getTopCategories(scores);
    
    return {
      scores,
      topCategories,
      totalQuestionsProcessed: answers.length
    };
  } catch (error) {
    console.error('計算健康分數失敗:', error);
    throw error;
  }
}
