const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const requireAuth = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/roleMiddleware');

router.post('/restock', requireAuth, requireAdmin, inventoryController.restockInventory);

module.exports = router;