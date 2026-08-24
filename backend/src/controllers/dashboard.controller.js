import Log from '../models/log.model.js';

export const getStats = async (req, res, next) => {
  try {
    const [totalLogs, totalAnomalies, critical, errorCount, sources] = await Promise.all([
      Log.countDocuments(),
      Log.countDocuments({ isAnomaly: true }),
      Log.countDocuments({ anomalyLevel: 'critical' }),
      Log.countDocuments({ status: { $gte: 400 } }),
      Log.distinct('source')
    ]);

    res.json({ success: true, data: {
      totalLogs,
      anomalies: totalAnomalies,
      critical,
      errorRate: totalLogs ? Number(((errorCount / totalLogs) * 100).toFixed(2)) : 0,
      sources: sources.length
    }});
  } catch (error) { next(error); }
};

export const getActivity = async (req, res, next) => {
  try {
    const latest = await Log.findOne().sort({ timestamp: -1 }).select('timestamp').lean();
    if (!latest) return res.json({ success: true, data: [] });

    const range = req.query.range || '24h';
    const hours = range === '1h' ? 1 : range === '7d' ? 168 : 24;
    const end = new Date(latest.timestamp);
    const start = new Date(end.getTime() - hours * 60 * 60 * 1000);
    const bucketMs = hours <= 1 ? 5 * 60 * 1000 : hours <= 24 ? 30 * 60 * 1000 : 6 * 60 * 60 * 1000;

    const logs = await Log.find({ timestamp: { $gte: start, $lte: end } }).select('timestamp isAnomaly anomalyLevel').lean();
    const buckets = new Map();

    for (let cursor = start.getTime(); cursor <= end.getTime(); cursor += bucketMs) {
      const key = new Date(cursor).toISOString();
      buckets.set(key, { time: key, totalLogs: 0, normalLogs: 0, anomalies: 0, criticalLogs: 0 });
    }

    for (const log of logs) {
      const t = new Date(log.timestamp).getTime();
      const bucketStart = start.getTime() + Math.floor((t - start.getTime()) / bucketMs) * bucketMs;
      const key = new Date(bucketStart).toISOString();
      const bucket = buckets.get(key);
      if (!bucket) continue;
      bucket.totalLogs += 1;
      if (log.isAnomaly) {
        bucket.anomalies += 1;
        if (log.anomalyLevel === 'critical') bucket.criticalLogs += 1;
      } else bucket.normalLogs += 1;
    }

    res.json({ success: true, data: Array.from(buckets.values()) });
  } catch (error) { next(error); }
};

export const topSources = async (req, res, next) => {
  try {
    const data = await Log.aggregate([
      { $match: { isAnomaly: true } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, source: '$_id', count: 1 } }
    ]);
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

export const anomalyBreakdown = async (req, res, next) => {
  try {
    const grouped = await Log.aggregate([
      { $match: { isAnomaly: true } },
      { $group: { _id: '$anomalyLevel', count: { $sum: 1 } } }
    ]);
    const data = { critical: 0, high: 0, medium: 0, low: 0 };
    for (const item of grouped) {
      if (item._id === 'critical') data.critical = item.count;
      else if (item._id === 'high') data.high = item.count;
      else if (item._id === 'suspicious') data.medium = item.count;
      else data.low += item.count;
    }
    res.json({ success: true, data });
  } catch (error) { next(error); }
};
