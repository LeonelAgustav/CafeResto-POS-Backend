const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const requireAuth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 * name: Orders
 * description: Manajemen Transaksi & Pesanan
 */

/**
 * @swagger
 * api/v1/orders/checkout:
 * post:
 * summary: Buat Pesanan Baru (Checkout)
 * description: Memotong stok bahan, membuat record order, dan mengembalikan detail transaksi.
 * tags: [Orders]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - items
 * - paymentMethod
 * properties:
 * userId:
 * type: string
 * format: uuid
 * description: ID User dari Supabase (Optional jika pakai Token)
 * paymentMethod:
 * type: string
 * enum: [cash, qris]
 * example: cash
 * items:
 * type: array
 * items:
 * type: object
 * properties:
 * menuId:
 * type: integer
 * example: 1
 * qty:
 * type: integer
 * example: 2
 * responses:
 * 200:
 * description: Transaksi berhasil dibuat
 * 400:
 * description: Stok tidak cukup atau data invalid
 */
router.post('/checkout', requireAuth, orderController.createOrder);

/**
 * @swagger
 * api/v1/orders/{orderId}/cancel:
* post:
 * summary: Batalkan Pesanan
 * description: Membatalkan status order dan mengembalikan stok bahan.
 * tags: [Orders]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - orderId
 * properties:
 * orderId:
 * type: integer
 * example: 105
 * reason:
 * type: string
 * example: "Pelanggan berubah pikiran"
 * responses:
 * 200:
 * description: Order berhasil dibatalkan
 * 404:
 * description: Order tidak ditemukan
 */
router.post('/:orderId/cancel', requireAuth, orderController.cancelOrder);

module.exports = router;