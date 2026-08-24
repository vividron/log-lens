import Log from '../models/log.model.js';
import { parseBuffer } from '../utils/parser.js';
import { validateRecord } from '../utils/validation.js';
import { scoreRecords } from './anomaly.service.js';

export const processUpload = async (file) => {
  const records = parseBuffer(file.buffer, file.mimetype, file.originalname);
  const validationErrors = [];
  const validRecords = [];

  records.forEach((record, index) => {
    const errors = validateRecord(record);
    if (errors.length) validationErrors.push({ index, reason: errors.join('; ') });
    else validRecords.push(record);
  });

  if (!validRecords.length) {
    const error = new Error('No valid records found');
    error.status = 400;
    error.errors = validationErrors;
    throw error;
  }

  const analyzed = scoreRecords(validRecords).map((record) => ({
    ...record,
    timestamp: new Date(record.timestamp),
    status: record.status === undefined || record.status === '' ? undefined : Number(record.status),
  }));

  const inserted = await Log.insertMany(analyzed);
  const anomalies = inserted.filter((doc) => doc.isAnomaly).length;

  return {
    message: 'Logs processed successfully',
    summary: {
      total: records.length,
      valid: validRecords.length,
      invalid: validationErrors.length,
      anomalies,
      missingTimestamps: validationErrors.filter((e) => e.reason.includes('Missing timestamp')).length
    },
    validationErrors
  };
};

const addStatusFilter = (filter, status) => {
  if (!status || status === 'ALL') return;
  if (/^[2-5]xx$/i.test(status)) {
    const prefix = Number(status[0]);
    filter.status = { $gte: prefix * 100, $lt: (prefix + 1) * 100 };
    return;
  }
  const code = Number(status);
  if (Number.isInteger(code)) filter.status = code;
};

const addSeverityFilter = (filter, severity) => {
  if (!severity || severity === 'ALL') return;
  const value = String(severity).toUpperCase();
  const mappings = {
    CRITICAL: { $or: [{ anomalyLevel: 'critical' }, { severity: 'critical' }] },
    HIGH: { $or: [{ anomalyLevel: 'high' }, { severity: 'error' }] },
    MEDIUM: { $or: [{ anomalyLevel: 'suspicious' }, { severity: 'warn' }] },
    LOW: { $or: [{ anomalyLevel: 'normal' }, { severity: 'info' }, { severity: 'debug' }] },
    NORMAL: { isAnomaly: false, severity: { $in: ['info', 'debug'] } }
  };
  if (mappings[value]) Object.assign(filter, mappings[value]);
};

const buildSearchFilter = (search) => {
  if (!search?.trim()) return null;
  const regex = { $regex: search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  return { $or: [
    { source: regex },
    { eventType: regex },
    { endpoint: regex },
    { message: regex },
    { 'detectionReasons.message': regex }
  ] };
};

export const getLogs = async (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 50));
  const skip = (page - 1) * limit;
  const filter = {};

  addSeverityFilter(filter, query.severity);
  addStatusFilter(filter, query.status);
  if (query.source) filter.source = query.source;
  if (query.eventType) filter.eventType = query.eventType;
  if (query.anomalyFilter === 'ANOMALIES_ONLY') filter.isAnomaly = true;
  if (query.anomalyFilter === 'NORMAL_ONLY') filter.isAnomaly = false;
  if (query.isAnomaly !== undefined && query.anomalyFilter === undefined) filter.isAnomaly = query.isAnomaly === 'true' || query.isAnomaly === true;

  const searchFilter = buildSearchFilter(query.search);
  const mongoFilter = searchFilter ? { $and: [filter, searchFilter] } : filter;

  const sortField = ['timestamp', 'anomalyScore', 'status'].includes(query.sortBy) ? query.sortBy : 'timestamp';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

  const [total, data] = await Promise.all([
    Log.countDocuments(mongoFilter),
    Log.find(mongoFilter).sort({ [sortField]: sortDirection }).skip(skip).limit(limit).lean()
  ]);

  return {
    success: true,
    data,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
  };
};

export const getLogById = async (id) => {
  const doc = await Log.findById(id).lean();
  if (!doc) { const error = new Error('Log not found'); error.status = 404; throw error; }
  return { success: true, data: doc };
};

export const deleteAll = async () => {
  const result = await Log.deleteMany({});
  return { success: true, deletedCount: result.deletedCount };
};
