const uploadsService = require('../services/upload.service');

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { buffer, originalname, mimetype } = req.file;
    const result = await uploadsService.uploadBuffer(buffer, originalname, mimetype);

    res.status(201).json({ success: true, data: { url: result.url, blobName: result.blobName } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile
};