const severityPoints = (status, severity) => {
  const code = Number(status);
  if (code >= 500 && code <= 599) return 40;
  if (code === 429) return 25;
  if (code === 403) return 25;
  if (code === 401) return 15;
  if (code === 404) return 10;
  const s = String(severity || '').toLowerCase();
  if (s === 'critical' || s === 'error') return 30;
  if (s === 'warn') return 10;
  return 0;
};

export const classifyLevel = (score) => {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 30) return 'suspicious';
  return 'normal';
};

export const analyzeBatchBaselines = (records) => {
  const bySource = {};
  const byEndpoint = {};

  for (const record of records) {
    const source = record.source || 'unknown';
    const timestamp = new Date(record.timestamp).getTime();
    const status = Number(record.status) || 0;
    bySource[source] ||= { total: 0, errors: 0, timestamps: [] };
    bySource[source].total += 1;
    if (status >= 400) bySource[source].errors += 1;
    bySource[source].timestamps.push(timestamp);

    const endpoint = record.endpoint || record.eventType || 'unknown';
    byEndpoint[endpoint] = (byEndpoint[endpoint] || 0) + 1;
  }

  for (const source of Object.keys(bySource)) {
    const item = bySource[source];
    item.timestamps.sort((a, b) => a - b);
    const spanMinutes = Math.max(1, (item.timestamps.at(-1) - item.timestamps[0]) / 60000);
    item.rpm = item.total / spanMinutes;
    item.errorRate = item.errors / item.total;
  }

  return { bySource, byEndpoint };
};

export const scoreRecords = (records) => {
  const baselines = analyzeBatchBaselines(records);
  const sorted = [...records].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const recentBySource = new Map();

  return sorted.map((record) => {
    const reasons = [];
    let score = severityPoints(record.status, record.severity);
    const status = Number(record.status) || 0;

    if (score > 0) {
      reasons.push({ type: 'severity', message: `HTTP ${status} / ${record.severity} severity`, points: score });
    }

    const source = record.source || 'unknown';
    const baseline = baselines.bySource[source];
    const recent = recentBySource.get(source) || [];
    const currentTime = new Date(record.timestamp).getTime();
    const windowStart = currentTime - 60_000;
    const window = recent.filter((r) => new Date(r.timestamp).getTime() >= windowStart);
    const recentFailures = window.filter((r) => Number(r.status) >= 500).length;

    if (recentFailures >= 3) {
      const points = Math.min(25, recentFailures * 8);
      score += points;
      reasons.push({ type: 'frequency', message: `${recentFailures} server failures from this source within 60 seconds`, points });
    }

    if (baseline && baseline.rpm > 0 && window.length >= 3) {
      const currentRpm = window.length;
      const factor = currentRpm / Math.max(1, baseline.rpm);
      if (factor >= 3) {
        const points = Math.min(20, Math.max(5, Math.round((factor - 1) * 5)));
        score += points;
        reasons.push({ type: 'rate', message: `Request rate is ${factor.toFixed(1)}x above the source baseline`, points });
      }
    }

    if (baseline && status >= 400 && baseline.errorRate < 0.05) {
      score += 20;
      reasons.push({ type: 'behavior', message: `Error from a source with a historically low error rate (${(baseline.errorRate * 100).toFixed(1)}%)`, points: 20 });
    }

    score = Math.min(100, Math.round(score));
    const anomalyLevel = classifyLevel(score);
    const result = {
      ...record,
      isAnomaly: score >= 30,
      anomalyScore: score,
      anomalyLevel,
      detectionReasons: reasons
    };

    recent.push(record);
    recentBySource.set(source, recent.slice(-100));
    return result;
  });
};

export const scoreRecord = (record, baselines, recentRecordsBySource) => {
  // Kept for compatibility with older imports. New code should use scoreRecords().
  return scoreRecords([record])[0];
};
