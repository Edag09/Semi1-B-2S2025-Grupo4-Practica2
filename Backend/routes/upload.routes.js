const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadsController = require('../controllers/upload.controller');

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Upload endpoint: público, sin autenticación
router.post('/foto', upload.single('file'), uploadsController.uploadFile);

module.exports = router;
