import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  products: [String], // 推薦產品編碼
  note: String,       // 備註
  productInput: String, // 前端暫存用，可選
  description: String,  // 詳細介紹
  ingredients: String,  // 推薦配方成份
  formula: String      // 對應配方
}, { _id: false });

const RecommendSchema = new mongoose.Schema({
  item: { type: String, required: true }, // 只存英文代碼
  scores: {
    type: mongoose.Schema.Types.Mixed, // 改用 Mixed 類型，更靈活
    default: {}
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 更新時自動設定 updatedAt
RecommendSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Recommend || mongoose.model('Recommend', RecommendSchema);
