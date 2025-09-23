import mongoose from 'mongoose';

const PetBreedSchema = new mongoose.Schema({
  petType: { type: String, required: true, enum: ['cat', 'dog'] }, // 寵物類型
  breedName: { type: String, required: true }, // 品種名稱
  description: { type: String, default: '' }, // 品種描述
  healthItems: {
    type: Map,
    of: String // 健康項目說明
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 更新時自動設定 updatedAt
PetBreedSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 建立複合索引，確保同一類型下品種名稱唯一
PetBreedSchema.index({ petType: 1, breedName: 1 }, { unique: true });

export default mongoose.models.PetBreed || mongoose.model('PetBreed', PetBreedSchema);
