import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const DetectionReasonSchema = new Schema({
  type: { type: String, default: 'rule' },
  message: { type: String, required: true },
  points: { type: Number, required: true, min: 0 }
}, { _id: false });

const AIAnalysisSchema = new Schema({
  explanation: String,
  likelyCause: String,
  recommendedNextStep: String,
  generatedAt: Date
}, { _id: false });

const LogSchema = new Schema({
  timestamp: { type: Date, required: true, index: true },
  source: { type: String, required: true, index: true },
  eventType: { type: String, required: true, index: true },
  severity: { type: String, required: true, index: true, enum: ['debug', 'info', 'warn', 'error', 'critical'] },
  status: { type: Number },
  endpoint: { type: String },
  message: { type: String, required: true },
  rawLog: { type: String },
  isAnomaly: { type: Boolean, default: false, index: true },
  anomalyScore: { type: Number, default: 0, index: true },
  anomalyLevel: { type: String, enum: ['normal', 'suspicious', 'high', 'critical'], default: 'normal', index: true },
  detectionReasons: [DetectionReasonSchema],
  aiAnalysis: AIAnalysisSchema
}, { timestamps: true });

LogSchema.index({ timestamp: -1 });
LogSchema.index({ isAnomaly: 1, anomalyScore: -1 });

export default model('Log', LogSchema);
