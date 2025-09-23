const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// 讀取 JSON 資料
const petBreedsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/petBreeds.json'), 'utf8')
);

// 定義 PetBreed Schema
const PetBreedSchema = new mongoose.Schema({
  petType: { type: String, required: true, enum: ['cat', 'dog'] },
  breedName: { type: String, required: true },
  description: { type: String, default: '' },
  healthItems: {
    type: Map,
    of: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PetBreedSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

PetBreedSchema.index({ petType: 1, breedName: 1 }, { unique: true });

const PetBreed = mongoose.models.PetBreed || mongoose.model('PetBreed', PetBreedSchema);

async function seedPetBreeds() {
  try {
    // 連接 MongoDB
    const MONGODB_URI = 'mongodb://mongo:2vCSAw7cH0RYyDxL51OJ4IWBEd3T98P6@hnd1.clusters.zeabur.com:31291';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 已連接到 MongoDB');

    // 清空現有資料
    await PetBreed.deleteMany({});
    console.log('🗑️ 已清空現有的 PetBreed 資料');

    // 準備要插入的資料
    const petBreedsToInsert = [];

    for (const [petType, breeds] of Object.entries(petBreedsData)) {
      for (const [breedName, breedData] of Object.entries(breeds)) {
        // 轉換 healthItems 為 Map 格式
        const healthItemsMap = new Map();
        for (const [item, description] of Object.entries(breedData.healthItems)) {
          healthItemsMap.set(item, description);
        }

        petBreedsToInsert.push({
          petType,
          breedName,
          description: breedData.description,
          healthItems: healthItemsMap,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // 批量插入資料
    const result = await PetBreed.insertMany(petBreedsToInsert);
    console.log(`✅ 成功插入 ${result.length} 筆 PetBreed 資料`);

    // 顯示插入的資料摘要
    console.log('\n📊 插入的資料摘要:');
    const catCount = result.filter(doc => doc.petType === 'cat').length;
    const dogCount = result.filter(doc => doc.petType === 'dog').length;
    console.log(`- 貓品種: ${catCount} 個`);
    console.log(`- 狗品種: ${dogCount} 個`);

    console.log('\n🐱 貓品種列表:');
    result.filter(doc => doc.petType === 'cat').forEach(doc => {
      console.log(`  - ${doc.breedName}`);
    });

    console.log('\n🐶 狗品種列表:');
    result.filter(doc => doc.petType === 'dog').forEach(doc => {
      console.log(`  - ${doc.breedName}`);
    });

  } catch (error) {
    console.error('❌ 執行失敗:', error);
  } finally {
    // 關閉連接
    await mongoose.disconnect();
    console.log('🔌 已斷開 MongoDB 連接');
  }
}

// 執行腳本
seedPetBreeds();
