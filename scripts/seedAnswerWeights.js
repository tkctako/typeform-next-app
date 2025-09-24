const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// 讀取 JSON 資料
const answerWeightsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/answerWeights.json'), 'utf8')
);

// 定義 AnswerWeight Schema
const AnswerWeightSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true },
  questionTitle: { type: String, required: true },
  answerWeights: {
    type: Map,
    of: {
      type: Map,
      of: Number
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 更新時自動設定 updatedAt
AnswerWeightSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const AnswerWeight = mongoose.models.AnswerWeight || mongoose.model('AnswerWeight', AnswerWeightSchema);

// 問題標題對照表
const questionTitles = {
  "OCx06HNqyfRR": "汪星人的年齡？",
  "SCSofQklMIXT": "喵星人的年齡？",
  "GI8YbuaWP81M": "您覺得寶貝的目前的體態狀況如何呢？",
  "88gYqTMhGMYt": "寶貝是否已結紮",
  "tY25d8xW6avl": "汪星人平常的居住環境",
  "AchHFVv83TGg": "喵星人平常的居住環境",
  "mk6h7aF3rC00": "室內環境中是否使用冷氣",
  "1UzCL5ETzB5H": "您想為寶貝保健的方向（可複選）",
  "nlq7BhnfT0ku": "寶貝是否會出現吃太快、吐食或反芻的狀況？",
  "wEdniu8bfauh": "寶貝是否常有脹氣、放屁、打嗝等消化不良狀況？",
  "89WHqMK74Inu": "寶貝的排便情況是否正常？",
  "QeyXYG84fBAJ": "寶貝在休息後剛起身時是否顯得僵硬或慢動作？",
  "91OSxmpo85Uj": "寶貝在日常走路時是否會出現跛腳、僵硬或異常步態？",
  "5mchUhmMmXM7": "寶貝在跑動、上下樓梯、跳上沙發或床時是否吃力？",
  "s1KOSBz6vdnO": "寶貝是否有頻尿、少量多次或憋尿情況？",
  "PtdgJjgNpdtB": "寶貝排尿時是否有表現出掙扎、不舒服或呻吟？",
  "sO4FEv98o185": "寶貝的尿液是否曾有異常氣味、顏色混濁或含血？",
  "4zzJeQugKs4U": "寶貝是否有明顯掉毛、毛髮粗糙或稀疏？",
  "1qvmwgeRsX7i": "是否經常看到寶貝抓癢、舔毛或咬皮膚？",
  "i7lGuJjpCk2U": "是否曾出現紅疹、皮屑、異味或皮膚異常？",
  "TZRZLsJRKZgg": "寶貝在獨處時，是否容易出現不安或異常行為？",
  "4r6iyfQo5UYK": "寶貝是否對新環境、搬家或陌生空間容易緊張、不安或不願探索？",
  "J9vSx76ASdKP": "寶貝是否對聲音特別敏感？",
  "W9tDwUbMLPzN": "寶貝的體型是否已影響日常活動？",
  "lHfNIJcjtG2n": "寶貝的食慾是否異常（暴食、挑食或食量變化大）？",
  "33Bpbj6NvPG6": "寶貝的體重變化是否穩定？",
  "Z8dsIrgYXAzH": "寶貝是否在日常生活中變得不愛活動？",
  "1TVDYuk0jGar": "寶貝在短時間運動後是否表現出疲憊或呼吸急促？",
  "3rdB1Dc8C2Mb": "寶貝是否曾有喘息、咳嗽或夜間呼吸不規律的情況？",
  "cV6GYtzBETmh": "寶貝是否經常眨眼或揉眼睛？",
  "NA30VERyt14J": "寶貝是否在強光下顯得不適，或在低光環境下行動異常？",
  "GVvU76rBGIYd": "是否發現眼睛分泌物增加、眼白變紅或眼睛混濁的情況？",
  "TstMewOzQrWZ": "寶貝是否容易生病、反覆感染或體質虛弱？",
  "9kMQcoK7eVO4": "寶貝是否容易出現過敏反應（如皮膚紅疹、打噴嚏、流鼻水）？",
  "HFkk2DCJqMXK": "寶貝是否曾出現過長時間恢復的疾病症狀，或是否對普通感染恢復較慢？",
  "oiciZoATwsUl": "為了讓我們的 AI 系統提供更安全且貼近寶貝需求的保健建議，請勾選寶貝是否已有已知的疾病。",
  "uPYaYmDniYXi": "若寶貝曾經歷過手術或有特殊健康狀況，我們的 AI 系統將會嘗試標示為高關懷對象，並在未來進一步進行健康分析與提供建議。"
};

async function seedAnswerWeights() {
  try {
    // 連接 MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 已連接到 MongoDB');

    // 清空現有資料（可選）
    await AnswerWeight.deleteMany({});
    console.log('️ 已清空現有的 AnswerWeight 資料');

    // 準備要插入的資料
    const answerWeightsToInsert = [];

    for (const [questionId, answerWeights] of Object.entries(answerWeightsData)) {
      const questionTitle = questionTitles[questionId] || `問題 ${questionId}`;
      
      // 轉換 answerWeights 為 Map 格式
      const answerWeightsMap = new Map();
      for (const [answerId, weights] of Object.entries(answerWeights)) {
        const weightsMap = new Map();
        for (const [category, score] of Object.entries(weights)) {
          weightsMap.set(category, score);
        }
        answerWeightsMap.set(answerId, weightsMap);
      }

      answerWeightsToInsert.push({
        questionId,
        questionTitle,
        answerWeights: answerWeightsMap,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // 批量插入資料
    const result = await AnswerWeight.insertMany(answerWeightsToInsert);
    console.log(`✅ 成功插入 ${result.length} 筆 AnswerWeight 資料`);

    // 顯示插入的資料摘要
    console.log('\n📊 插入的資料摘要:');
    for (const doc of result) {
      console.log(`- ${doc.questionTitle} (${doc.questionId}): ${doc.answerWeights.size} 個答案選項`);
    }

  } catch (error) {
    console.error('❌ 執行失敗:', error);
  } finally {
    // 關閉連接
    await mongoose.disconnect();
    console.log('🔌 已斷開 MongoDB 連接');
  }
}

// 執行腳本
seedAnswerWeights();
