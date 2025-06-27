const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');

// Set file size limit (5MB) and only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed!'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 5MB
});

// Upload Endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  res.status(200).json({
    url: req.file.path,
    filename: req.file.filename,
  });
}, (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Max 5MB allowed.' });
  }
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
