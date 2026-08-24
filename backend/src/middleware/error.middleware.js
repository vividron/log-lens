export const errorHandler = (err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err.toString());
  const status = err.status || 500;
  const response = { success: false, message: err.message || 'Internal Server Error' };
  if (err.errors) response.errors = err.errors;
  res.status(status).json(response);
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};
