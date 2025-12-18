const Joi = require('joi');

const checkoutSchema = Joi.object({
  paymentMethod: Joi.string().valid('cash', 'qris', 'e_wallet').required(),
  items: Joi.array().items(
    Joi.object({
      menuId: Joi.number().integer().required(),
      qty: Joi.number().integer().min(1).required() // Qty minimal 1, gak boleh negatif
    })
  ).min(1).required() // Keranjang gak boleh kosong
});

module.exports = {
  checkoutSchema
};