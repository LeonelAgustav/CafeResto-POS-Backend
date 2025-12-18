const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * @swagger
 * tags:
 * name: Payments
 * description: Manajemen Pembayaran & Transaksi Keuangan
 */

/**
 * @swagger
 * api/v1/payments:
 * post:
 * summary: Proses Pembayaran (Konfirmasi)
 * description: Mencatat pembayaran untuk order tertentu (Simulasi Payment Gateway atau Input Kasir).
 * tags: [Payments]
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
 * - amount
 * - method
 * properties:
 * orderId:
 * type: integer
 * example: 105
 * description: ID Order yang akan dibayar
 * amount:
 * type: number
 * example: 45000
 * description: Nominal uang yang dibayarkan
 * method:
 * type: string
 * enum: [cash, qris, debit, credit_card]
 * example: qris
 * referenceId:
 * type: string
 * description: ID referensi dari mesin EDC atau Payment Gateway (Opsional)
 * example: "TRX-SUB-887766"
 * responses:
 * 200:
 * description: Pembayaran berhasil dicatat & Status Order diupdate jadi 'paid'
 * 400:
 * description: Data pembayaran tidak valid atau jumlah uang kurang
 * 404:
 * description: Order ID tidak ditemukan
 */
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;