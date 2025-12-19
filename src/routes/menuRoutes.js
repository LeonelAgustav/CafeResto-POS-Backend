const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const requireAuth = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/roleMiddleware');

router.post('/', requireAuth, requireAdmin, menuController.createMenu);

module.exports = router;