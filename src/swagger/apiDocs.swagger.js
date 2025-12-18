// /**
//  =============================================================================
//  DOKUMENTASI JSON API CAFERESTO
//  Backend: Node.js (Express) + Supabase
//  Base URL: https://caferesto-production.up.railway.app/api/v1
//  =============================================================================
// */

// /**
//  * @swagger
//  * /auth/login:
//  *   post:
//  *     summary: Login Staff atau Admin
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           example:
//  *             email: staff@caferesto.com
//  *             password: password123
//  *     responses:
//  *       200:
//  *         description: Login berhasil
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: Login successful
//  *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
//  *               user:
//  *                 id: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
//  *                 email: staff@caferesto.com
//  *                 role: authenticated
//  *       401:
//  *         description: Login gagal
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: Invalid login credentials
//  */

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Buat Pesanan (Checkout)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
 *             paymentMethod: cash
 *             items:
 *               - menuId: 1
 *                 qty: 2
 *               - menuId: 5
 *                 qty: 1
 *     responses:
 *       200:
 *         description: Order berhasil
 *         content:
 *           application/json:
 *             example:
 *               message: Order created successfully
 *               orderId: 105
 *               totalAmount: 45000
 *               status: pending
 *       400:
 *         description: Stok tidak cukup
 *         content:
 *           application/json:
 *             example:
 *               error: Insufficient stock for menu item: Kopi Susu (ID: 1)
 */

// /**
//  * @swagger
//  * /orders/{orderId}/cancel:
//  *   post:
//  *     summary: Batalkan Pesanan
//  *     tags: [Orders]
//  *     parameters:
//  *       - in: path
//  *         name: orderId
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Order dibatalkan
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: Order #105 cancelled successfully
//  *               restoredStock: true
//  *       404:
//  *         description: Order tidak ditemukan
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: Order not found or already cancelled
//  */

// /**
//  * @swagger
//  * /inventory/restock:
//  *   post:
//  *     summary: Restock Bahan Baku
//  *     tags: [Inventory]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           example:
//  *             ingredientId: 2
//  *             quantityAdded: 1000
//  *     responses:
//  *       200:
//  *         description: Stok berhasil diperbarui
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: Stock updated successfully
//  *               ingredient:
//  *                 id: 2
//  *                 name: Susu UHT
//  *                 new_stock: 5500
//  *                 unit: ml
//  */

// /**
//  * @swagger
//  * /menus:
//  *   post:
//  *     summary: Tambah Menu Baru
//  *     tags: [Menus]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           example:
//  *             name: Es Kopi Gula Aren
//  *             description: Kopi kekinian dengan gula aren asli
//  *             price: 18000
//  *             category: coffee
//  *             imageUrl: https://example.com/kopi-aren.jpg
//  *     responses:
//  *       201:
//  *         description: Menu berhasil dibuat
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: Menu created successfully
//  *               menuId: 12
//  */

// /**
//  * @swagger
//  * /payments:
//  *   post:
//  *     summary: Konfirmasi Pembayaran
//  *     tags: [Payments]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           example:
//  *             orderId: 105
//  *             amount: 45000
//  *             method: qris
//  *             referenceId: TRX-QRIS-998877
//  *     responses:
//  *       200:
//  *         description: Pembayaran sukses
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: Payment successful
//  *               orderId: 105
//  *               status: paid
//  *               change: 0
//  *       400:
//  *         description: Pembayaran gagal
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: Payment amount is less than total order amount
//  */
