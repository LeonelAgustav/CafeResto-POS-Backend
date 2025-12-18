const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const requireAuth = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 * name: Menus
 * description: Manajemen Menu Makanan/Minuman
 */

/**
 * @swagger
 * api/v1/menus:
 * post:
 * summary: Buat Menu Baru
 * tags: [Menus]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - price
 * - category
 * properties:
 * name:
 * type: string
 * example: "Kopi Gula Aren"
 * description:
 * type: string
 * example: "Kopi susu kekinian dengan gula aren asli"
 * price:
 * type: number
 * example: 18000
 * category:
 * type: string
 * enum: [coffee, non-coffee, snack, food]
 * example: coffee
 * imageUrl:
 * type: string
 * example: "https://example.com/kopi.jpg"
 * recipe:
 * type: array
 * description: Resep bahan baku untuk menu ini
 * items:
 * type: object
 * properties:
 * ingredientId:
 * type: integer
 * example: 2
 * quantityRequired:
 * type: number
 * example: 150
 * responses:
 * 201:
 * description: Menu berhasil dibuat
 */
router.post('/', requireAuth, menuController.createMenu);

module.exports = router;