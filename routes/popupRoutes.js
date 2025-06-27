const express = require('express');
const router = express.Router();
const popupController = require('../controllers/popupController');
const { isAdmin } = require('../middleware/authMiddleware');

// Routes
router.get('/status', popupController.getPopupStatus);
router.post('/update',  popupController.updatePopupStatus);

module.exports = router;
