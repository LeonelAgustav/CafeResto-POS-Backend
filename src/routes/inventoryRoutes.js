const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const requireAuth = require('../middlewares/authMiddleware');

router.post('/adjust', requireAuth, inventoryController.restock);

module.exports = router;