/**
 * @swagger
 * /api/get-result/{session_id}:
 *   get:
 *     tags:
 *       - Result Calculation
 *     summary: 根據 Session ID 計算寵物健康分數和結果
 *     description: 透過 Session ID 獲取問卷回答，計算九大健康項目分數並返回完整結果
 *     parameters:
 *       - in: path
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Typeform Session ID
 *         example: "ugplskupcpikn8xvlougpl1f2vlqonr1"
 *     responses:
 *       200:
 *         description: 結果計算成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetResultResponse'
 *       400:
 *         description: 缺少必要參數
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 找不到對應的問卷資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 伺服器內部錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   options:
 *     tags:
 *       - Result Calculation
 *     summary: CORS preflight request
 *     description: Handle CORS preflight requests for the get-result endpoint
 *     responses:
 *       200:
 *         description: CORS headers returned successfully
 */

import { NextResponse } from 'next/server';
import { calculateHealthScores } from '@/lib/scoreCalculator';
import mongoose from 'mongoose';
import PetBreed from '@/models/PetBreed';
import Recommend from '@/models/Recommend';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

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

// 從問卷答案中提取寵物資訊
function extractPetInfo(answers) {
  let name = null;
  let gender = null;
  let petType = null;
  let petBreed = null;
  let ageStage = null;
  let isNeutered = null;
  
  // 遍歷答案根據 field ID 或 choice ID 提取資訊
  answers.forEach((answer) => {
    // 姓名有 field.id
    if (answer.field?.id === "ZfnWUMyyIWWt") { // 姓名
      if (answer.type === 'text' && answer.text) {
        name = answer.text;
      }
    }
    else if (answer.field?.id === "99FubVegwyW9") { // 品種
      if (answer.type === 'text' && answer.text) {
        petBreed = answer.text;
      }
    }
    // 其他答案使用 choice.id
    else if (answer.type === 'choice' && answer.choice?.id) {
      switch (answer.choice.id) {
        case "iiVn0Pk3k02B": // 性別
          gender = answer.choice.label;
          break;
        case "bGKe1xCLqgt7": // 種族
          // 將中文轉換為英文類型
          if (answer.choice.label === '汪星人') {
            petType = 'dog';
          } else if (answer.choice.label === '喵星人') {
            petType = 'cat';
          }
          break;
        case "Kd5iKQLGPHaL": // 年齡
          ageStage = answer.choice.label;
          break;
        case "7JfAXMaGDvjU": // 是否結紮
          isNeutered = answer.choice.label;
          break;
      }
    }
  });
  
  return { name, gender, petType, petBreed, ageStage, isNeutered };
}

// 從 MongoDB 獲取寵物詳細資料
async function getPetDetails(petType, petBreed) {
  try {
    await connectDB();
    
    if (!petType || !petBreed) {
      return null;
    }
    
    const petDetails = await PetBreed.findOne({
      petType: petType,
      breedName: petBreed
    });
    
    return petDetails;
  } catch (error) {
    console.error('獲取寵物詳細資料失敗:', error);
    return null;
  }
}

// 九大項中文與英文代碼對照
const categoryMap = {
  '腸胃': 'digestive',
  '關節': 'joint',
  '泌尿': 'urinary',
  '皮毛': 'skin',
  '情緒': 'emotion',
  '體重': 'weight',
  '心血管': 'cardiovascular',
  '眼睛': 'eye',
  '免疫': 'immune'
};

// 根據分數獲取推薦商品 - 比照 recommend API 的方式
async function getRecommendationsByScore(scores, topCategories) {
  try {
    await connectDB();
    
    console.log('開始獲取推薦商品，分數:', scores);
    console.log('前四名類別:', topCategories.slice(0, 4));
    
    const zeroScoreRecommendations = {}; // 0分區塊
    const highScoreRecommendations = {}; // 有分數區塊
    const scoreLevels = {}; // 關注等級
    
    // 1. 獲取所有九大項的0分推薦商品 - 使用查詢全部的方式
    console.log('獲取所有九大項的0分推薦商品');
    
    // 比照 recommend API 的查詢全部方式
    const allRecommends = await Recommend.find({});
    console.log('查詢到的全部推薦資料:', allRecommends);
    
    // 遍歷所有九大項，獲取0分推薦資料和關注等級
    for (const [category, categoryCode] of Object.entries(categoryMap)) {
      console.log(`處理0分項目: ${category} -> ${categoryCode}`);
      
      const recommend = allRecommends.find(r => r.item === categoryCode);
      console.log(`找到推薦資料:`, recommend);
      
      if (recommend && recommend.scores && recommend.scores['0']) {
        console.log(`0分推薦資料:`, recommend.scores['0']);
        zeroScoreRecommendations[category] = {
          score: 0,
          data: recommend.scores['0']
        };
      } else {
        console.log(`沒有找到 ${categoryCode} 的0分推薦資料`);
      }
      
      // 獲取對應分數的關注等級
      const score = scores[category];
      if (score !== undefined && recommend && recommend.scores) {
        // 尋找最接近的分數
        let targetScore = Math.floor(score);
        if (score % 1 !== 0) {
          // 如果有小數點，向上取整
          targetScore = Math.ceil(score);
        }
        
        // 確保分數在0-10範圍內
        targetScore = Math.max(0, Math.min(10, targetScore));
        
        if (recommend.scores[targetScore.toString()]) {
          scoreLevels[category] = {
            score: score,
            level: recommend.scores[targetScore.toString()].note || '無'
          };
        } else {
          scoreLevels[category] = {
            score: score,
            level: '無'
          };
        }
      }
    }
    
    // 2. 獲取前四名最高分數項目的推薦商品 - 使用查詢單一的方式
    for (const topCategory of topCategories.slice(0, 4)) {
      const category = topCategory.category;
      const score = topCategory.score;
      const categoryCode = categoryMap[category];
      
      console.log(`處理高分項目: ${category} (${score}) -> ${categoryCode}`);
      
      if (categoryCode) {
        // 比照 recommend API 的查詢單一方式
        const recommend = await Recommend.findOne({ item: categoryCode });
        console.log(`找到推薦資料:`, recommend);
        
        if (recommend && recommend.scores) {
          // 尋找最接近的分數
          let targetScore = Math.floor(score);
          if (score % 1 !== 0) {
            // 如果有小數點，向上取整
            targetScore = Math.ceil(score);
          }
          
          // 確保分數在0-10範圍內
          targetScore = Math.max(0, Math.min(10, targetScore));
          
          console.log(`目標分數: ${score} -> ${targetScore}`);
          console.log(`可用的分數:`, Object.keys(recommend.scores));
          
          if (recommend.scores[targetScore.toString()]) {
            console.log(`找到推薦資料:`, recommend.scores[targetScore.toString()]);
            // 存放在有分數區塊
            highScoreRecommendations[category] = {
              score: score,
              targetScore: targetScore,
              data: recommend.scores[targetScore.toString()]
            };
          } else {
            console.log(`沒有找到 ${categoryCode} 的 ${targetScore} 分推薦資料`);
          }
        } else {
          console.log(`沒有找到 ${categoryCode} 的推薦資料`);
        }
      }
    }
    
    const result = {
      zeroScoreRecommendations,
      highScoreRecommendations,
      scoreLevels
    };
    
    console.log('最終推薦結果:', result);
    return result;
  } catch (error) {
    console.error('獲取推薦商品失敗:', error);
    throw error;
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request, { params }) {
  try {
    const { session_id } = await params; // Next.js 15 compatibility fix
    console.log('session_id', session_id);
    
    if (!session_id) {
      return new Response(JSON.stringify({ error: '缺少 session_id 參數' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 調用 Typeform API 獲取問卷資料
    const TYPEFORM_TOKEN = process.env.TYPEFORM_TOKEN;
    const FORM_ID = process.env.FORM_ID;

    if (!TYPEFORM_TOKEN || !FORM_ID) {
      return new Response(JSON.stringify({ error: '缺少必要的環境變數' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const url = new URL(`https://api.typeform.com/forms/${FORM_ID}/responses`);
    url.searchParams.append('query', session_id); // Use 'query' for session_id search

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${TYPEFORM_TOKEN}` },
    });
    const data = await res.json();

    const matchedResponse = (data.items || []).find(item => item.hidden && item.hidden.session_id === session_id);

    if (!matchedResponse) {
      return new Response(JSON.stringify({ message: 'No response found for this session_id' }), { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    // 提取答案資料
    const answers = matchedResponse.answers || [];

    // 從答案中提取寵物資訊
    const { name, gender, petType, petBreed, ageStage, isNeutered } = extractPetInfo(answers);
    console.log('提取的寵物資訊:', { name, gender, petType, petBreed, ageStage, isNeutered });

    // 使用共用的分數計算功能
    const { scores, topCategories, totalQuestionsProcessed } = await calculateHealthScores(answers);

    // 從 MongoDB 獲取寵物詳細資料
    const petDetails = await getPetDetails(petType, petBreed);
    console.log('寵物詳細資料:', petDetails);

    // 根據分數獲取推薦商品
    const recommendations = await getRecommendationsByScore(scores, topCategories);
    console.log('推薦商品:', recommendations);

    // 返回結果
    const result = {
      success: true,
      session_id: session_id,
      pet_info: {
        name: name,
        gender: gender,
        type: petType,
        breed: petBreed,
        ageStage: ageStage,
        isNeutered: isNeutered,
        details: petDetails ? {
          description: petDetails.description,
          healthItems: Object.fromEntries(petDetails.healthItems || new Map())
        } : null
      },
      scores: scores,
      top_categories: topCategories,
      recommendations: recommendations,
      total_questions_processed: totalQuestionsProcessed,
      message: "分數計算完成",
      raw_data: {
        response_id: matchedResponse.response_id,
        submitted_at: matchedResponse.submitted_at,
        answers_count: answers.length,
      }
    };

    return new Response(JSON.stringify(result), { 
      status: 200, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('結果計算API錯誤:', error);
    return new Response(JSON.stringify({ 
      error: '結果計算失敗', 
      details: error.message 
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}