const menuRepository = require('../repositories/menuRepository');
const Joi = require('joi');

class MenuController {

  async createMenu(req, res) {
    try {
      // Validasi Input
      const schema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().min(0).required(),
        categoryId: Joi.number().required(),
        recipes: Joi.array().items(
          Joi.object({
            ingredientId: Joi.number().required(),
            qtyRequired: Joi.number().positive().required()
          })
        ).min(1).required() // Menu wajib punya minimal 1 bahan
      });

      const { error, value } = schema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      // Eksekusi Repository
      const result = await menuRepository.createMenuWithRecipe(
        { name: value.name, price: value.price, categoryId: value.categoryId },
        value.recipes
      );

      res.json({
        status: 'SUCCESS',
        message: 'Menu & Resep berhasil dibuat',
        data: result
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new MenuController();