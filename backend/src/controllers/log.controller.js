import * as logService from '../services/log.service.js';

export const uploadLogs = async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('No file uploaded');
      err.status = 400;
      throw err;
    }
    const result = await logService.processUpload(req.file);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getLogs = async (req, res, next) => {
  try {
    const result = await logService.getLogs(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getLog = async (req, res, next) => {
  try {
    const result = await logService.getLogById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteLogs = async (req, res, next) => {
  try {
    const result = await logService.deleteAll();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
