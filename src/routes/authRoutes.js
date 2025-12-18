const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Manajemen Autentikasi User
 */

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Login Staff atau Admin
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * example: staff@caferesto.com
 * password:
 * type: string
 * example: 123456
 * responses:
 * 200:
 * description: Login berhasil, mengembalikan Token
 * 401:
 * description: Email atau password salah
 */
router.post('/login', authController.login);

module.exports = router;