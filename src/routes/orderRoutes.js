const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const requireAuth = require('../middlewares/authMiddleware');

router.post('/checkout', requireAuth, orderController.createOrder);
router.post('/:orderId/cancel', requireAuth, orderController.cancelOrder);

module.exports = router;