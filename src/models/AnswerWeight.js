import mongoose from 'mongoose';

const AnswerWeightSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true }, // Typeform 問題 ID
  questionTitle: { type: String, required: true }, // 問題標題
  answerWeights: {
    type: Map,
    of: {
      type: Map,
      of: Number // 健康項目分數
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

export default mongoose.models.AnswerWeight || mongoose.model('AnswerWeight', AnswerWeightSchema);
