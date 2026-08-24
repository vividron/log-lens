export const isValidTimestamp = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

export const validateRecord = (record) => {
  const errors = [];
  if (!record.timestamp) errors.push('Missing timestamp');
  else if (!isValidTimestamp(record.timestamp)) errors.push('Invalid timestamp');
  if (!record.source) errors.push('Missing source');
  if (!record.eventType) errors.push('Missing eventType');
  if (!record.severity) errors.push('Missing severity');
  if (!record.message) errors.push('Missing message');
  if (record.status !== undefined && record.status !== '' && !Number.isFinite(Number(record.status))) errors.push('Status should be numeric');
  return errors;
};
