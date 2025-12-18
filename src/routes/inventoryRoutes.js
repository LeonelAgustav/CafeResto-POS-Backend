const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const requireAuth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 * name: Inventory
 * description: Manajemen Stok & Bahan Baku
 */

/**
 * @swagger
 * api/v1/inventory/restock:
 * post:
 * summary: Tambah Stok Bahan Baku (Restock)
 * tags: [Inventory]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - ingredientId
 * - quantityAdded
 * properties:
 * ingredientId:
 * type: integer
 * example: 5
 * quantityAdded:
 * type: number
 * description: Jumlah stok yang baru dibeli/ditambah
 * example: 1000
 * responses:
 * 200:
 * description: Stok berhasil diperbarui
 * 404:
 * description: Bahan baku tidak ditemukan
 */
router.post('/adjust', requireAuth, inventoryController.restock);

module.exports = router;