const orderRepository = require('../repositories/orderRepository');
const paymentService = require('../services/paymentService');

class PaymentController {
  
  async handleWebhook(req, res) {
    try {
      const notification = req.body;
      
      // 1. Verifikasi Security (Pastikan yang ngirim benar2 Midtrans)
      if (!paymentService.verifySignature(notification)) {
        return res.status(403).json({ message: 'Invalid Signature' });
      }

      const orderId = notification.order_id;
      const transactionStatus = notification.transaction_status;
      const fraudStatus = notification.fraud_status;

      console.log(`Webhook Received: Order ${orderId} -> ${transactionStatus}`);

      // 2. Logic Update Status Order
      let newStatus = null;

      if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
        newStatus = 'paid';
      } else if (transactionStatus == 'deny' || transactionStatus == 'expire' || transactionStatus == 'cancel') {
        newStatus = 'cancelled';
        // TODO: Panggil inventoryService.restoreStock(orderId) di sini!
        // Ini PR penting: otomatis balikin stok kalo expire.
      }

      if (newStatus) {
        await orderRepository.updateStatus(orderId, newStatus);
      }

      res.status(200).json({ status: 'OK' });

    } catch (err) {
      console.error("Webhook Error:", err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = new PaymentController();