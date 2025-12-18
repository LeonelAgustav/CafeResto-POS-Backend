const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const requireAuth = require('../middlewares/authMiddleware');

router.post('/', requireAuth, menuController.createMenu);

module.exports = router;