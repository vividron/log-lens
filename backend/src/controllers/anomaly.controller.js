import mongoose from 'mongoose';
import Log from '../models/log.model.js';
import * as aiService from '../services/ai.service.js';

const searchFilter = (search) => {
  if (!search?.trim()) return null;
  const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = { $regex: safe, $options: 'i' };
  return { $or: [{ source: regex }, { eventType: regex }, { endpoint: regex }, { message: regex }, { 'detectionReasons.message': regex }] };
};

export const getAnomalies = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const filter = { isAnomaly: true };
    if (req.query.severity && req.query.severity !== 'ALL') {
      const severity = String(req.query.severity).toUpperCase();
      const levelMap = { CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'suspicious', LOW: 'normal' };
      if (levelMap[severity]) filter.anomalyLevel = levelMap[severity];
    }
    if (req.query.source) filter.source = req.query.source;
    if (req.query.minScore) filter.anomalyScore = { ...(filter.anomalyScore || {}), $gte: Number(req.query.minScore) };
    if (req.query.maxScore) filter.anomalyScore = { ...(filter.anomalyScore || {}), $lte: Number(req.query.maxScore) };
    const search = searchFilter(req.query.search);
    const mongoFilter = search ? { $and: [filter, search] } : filter;

    const [total, data] = await Promise.all([
      Log.countDocuments(mongoFilter),
      Log.find(mongoFilter).sort({ anomalyScore: -1, timestamp: -1 }).skip(skip).limit(limit).lean()
    ]);

    res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } });
  } catch (error) { next(error); }
};

export const getAnomalyById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { const e = new Error('Anomaly not found'); e.status = 404; throw e; }
    const doc = await Log.findOne({ _id: req.params.id, isAnomaly: true }).lean();
    if (!doc) { const e = new Error('Anomaly not found'); e.status = 404; throw e; }
    res.json({ success: true, data: doc });
  } catch (error) { next(error); }
};

export const analyzeAnomaly = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { const e = new Error('Anomaly not found'); e.status = 404; throw e; }
    const doc = await Log.findOne({ _id: req.params.id, isAnomaly: true });
    if (!doc) { const e = new Error('Anomaly not found'); e.status = 404; throw e; }
    const regenerate = req.query.regenerate === 'true';
    if (doc.aiAnalysis && !regenerate) return res.json({ success: true, data: doc.aiAnalysis });

    const analysis = await aiService.analyzeAnomaly({
      timestamp: doc.timestamp, source: doc.source, eventType: doc.eventType, endpoint: doc.endpoint,
      status: doc.status, severity: doc.severity, message: doc.message, rawLog: doc.rawLog,
      anomalyScore: doc.anomalyScore, anomalyLevel: doc.anomalyLevel, detectionReasons: doc.detectionReasons
    });
    doc.aiAnalysis = analysis;
    await doc.save();
    res.json({ success: true, data: analysis });
  } catch (error) { next(error); }
};
