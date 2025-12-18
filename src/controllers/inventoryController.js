const inventoryService = require('../services/inventoryService');
const Joi = require('joi');

class InventoryController {

  async restock(req, res) {
    try {
      // Validasi Input Sederhana
      const schema = Joi.object({
        ingredientId: Joi.number().required(),
        qty: Joi.number().required(), // Boleh negatif (waste) atau positif (restock)
        reason: Joi.string().required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      // Eksekusi Service
      const result = await inventoryService.adjustStock(
        value.ingredientId, 
        value.qty, 
        value.reason
      );

      res.json({
        status: 'SUCCESS',
        message: 'Stok berhasil diperbarui',
        data: result
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new InventoryController();