function displaySeverity(log) {
  if (log.isAnomaly && log.anomalyLevel) {
    return String(log.anomalyLevel).toUpperCase() === 'SUSPICIOUS' ? 'MEDIUM' : String(log.anomalyLevel).toUpperCase();
  }
  const severity = String(log.severity || 'info').toLowerCase();
  if (severity === 'critical') return 'CRITICAL';
  if (severity === 'error') return 'HIGH';
  if (severity === 'warn') return 'MEDIUM';
  return 'LOW';
}

export function normalizeDetectionReasons(reasons = []) {
  return (Array.isArray(reasons) ? reasons : []).map((reason) => ({
    type: reason.type || 'rule',
    reason: reason.reason || reason.message || 'Anomaly signal detected',
    score: Number(reason.score ?? reason.points ?? 0),
  }));
}

export function normalizeLog(log = {}) {
  const id = log.id || log._id;
  const endpoint = log.endpoint || '';
  const event = log.event || endpoint || log.eventType || 'EVENT';
  return {
    ...log,
    id,
    event,
    eventType: log.eventType || 'unknown',
    status: log.status == null ? '' : String(log.status),
    severity: displaySeverity(log),
    isAnomaly: Boolean(log.isAnomaly),
    anomalyScore: Number(log.anomalyScore || 0),
    anomalyLevel: log.anomalyLevel || 'normal',
    detectionReasons: normalizeDetectionReasons(log.detectionReasons),
    rawLog: log.rawLog || log.message || JSON.stringify(log),
  };
}

export function unwrapListResponse(response) {
  return {
    logs: (response?.data || []).map(normalizeLog),
    total: Number(response?.pagination?.total || 0),
    page: Number(response?.pagination?.page || 1),
    limit: Number(response?.pagination?.limit || 20),
    totalPages: Number(response?.pagination?.totalPages || 1),
  };
}
