import { parse } from 'csv-parse/sync';

const normalizeSeverity = (value) => {
  const s = String(value || 'info').trim().toLowerCase();
  if (['trace', 'debug'].includes(s)) return 'debug';
  if (['warn', 'warning', 'medium'].includes(s)) return 'warn';
  if (['error', 'high'].includes(s)) return 'error';
  if (['critical', 'fatal'].includes(s)) return 'critical';
  return 'info';
};

export const normalizeRecord = (raw) => {
  const r = {};
  r.timestamp = raw.timestamp || raw.time || raw.date || raw.datetime || raw.ts;
  r.source = raw.source || raw.ip || raw.ipAddress || raw.client || raw.client_ip || raw.host;
  r.eventType = raw.eventType || raw.event || raw.type || 'http_request';
  r.severity = normalizeSeverity(raw.severity || raw.level);
  r.status = raw.status ?? raw.statusCode ?? raw.status_code ?? raw.code;
  r.endpoint = raw.endpoint || raw.path || raw.url;
  r.message = raw.message || raw.msg || raw.log || '';
  r.rawLog = raw.rawLog || raw.raw || (typeof raw === 'string' ? raw : JSON.stringify(raw));
  return r;
};

export const parseCSV = (content) => parse(content, { columns: true, skip_empty_lines: true, bom: true }).map(normalizeRecord);

export const parseJSON = (content) => {
  const obj = JSON.parse(content);
  return (Array.isArray(obj) ? obj : [obj]).map(normalizeRecord);
};

export const parseBuffer = (buffer, mimeType, originalname) => {
  const text = buffer.toString('utf8');
  const ext = originalname.toLowerCase().split('.').pop();
  if (mimeType === 'application/json' || ext === 'json') return parseJSON(text);
  if (mimeType === 'text/csv' || ext === 'csv') return parseCSV(text);
  const err = new Error('Only CSV and JSON files are supported');
  err.status = 400;
  throw err;
};
