import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  products: [String], // 推薦產品編碼
  note: String,       // 備註
  productInput: String // 前端暫存用，可選
}, { _id: false });

const RecommendSchema = new mongoose.Schema({
  item: { type: String, required: true }, // 只存英文代碼
  scores: {
    type: Map,
    of: ProductSchema // 1~10分
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Recommend || mongoose.model('Recommend', RecommendSchema);
