class PaymentService {
  
  /**
   * Minta Token Transaksi ke Payment Gateway
   */
  async generatePaymentToken(orderId, amount, customerDetails) {
    // TODO: Nanti integrasi Midtrans Snap API di sini
    // const parameter = {
    //   transaction_details: { order_id: orderId, gross_amount: amount }
    // };
    // return midtrans.createTransaction(parameter);
    
    // MOCKUP DULU: Pura-pura generate token
    return `MOCK-TOKEN-${orderId}-${Date.now()}`;
  }

  /**
   * Verifikasi Signature Webhook (Security)
   */
  verifySignature(payload) {
    // TODO: Validasi signature SHA512 dari Midtrans
    return true;
  }
}

module.exports = new PaymentService();