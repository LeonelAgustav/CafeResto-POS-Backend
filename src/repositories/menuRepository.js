const supabase = require('../config/supabase');

class MenuRepository {
    /**
     * Mengambil Resep (BOM) berdasarkan List Menu ID yang dikirim.
     * @param {Array<number>} menuItemIds - Contoh: [1, 2]
     */
    async getRecipesByMenuIds(menuItemIds) {
        // Kita query ke tabel penghubung (menu_recipes)
        // Lalu kita JOIN ke tabel ingredients untuk melihat stok saat ini
        const { data, error } = await supabase
            .from('menu_recipes')
            .select(`
        menu_item_id,
        quantity_required,
        ingredient:ingredients (
          id,
          name,
          current_stock,
          unit
        )
      `)
            .in('menu_item_id', menuItemIds); // Filter berdasarkan ID menu yang dipesan

        if (error) {
            throw new Error(`MenuRepository Error: ${error.message}`);
        }

        return data;
    }

    /**
     * Mengambil detail harga untuk validasi backend.
     * @param {Array<number>} ids - List Menu ID
     */
    async getMenuPrices(ids) {
        const { data, error } = await supabase
            .from('menu_items')
            .select('id, base_price, name')
            .in('id', ids);

        if (error) throw new Error(`Gagal ambil harga: ${error.message}`);
        return data;
    }

    /**
     * Membuat Menu Baru + Resepnya secara Transactional
     */
    async createMenuWithRecipe(menuData, recipeItems) {
        // 1. Insert Menu Item
        const { data: newMenu, error: menuError } = await supabase
        .from('menu_items')
        .insert({
            name: menuData.name,
            base_price: menuData.price,
            category_id: menuData.categoryId,
            is_available: true
        })
        .select()
        .single();

        if (menuError) throw new Error(`Gagal buat menu: ${menuError.message}`);

        // 2. Siapkan data Resep
        const recipePayload = recipeItems.map(item => ({
        menu_item_id: newMenu.id,
        ingredient_id: item.ingredientId,
        quantity_required: item.qtyRequired
        }));

        // 3. Insert Resep (Bulk Insert)
        const { error: recipeError } = await supabase
        .from('menu_recipes')
        .insert(recipePayload);

        if (recipeError) {
        await supabase.from('menu_items').delete().eq('id', newMenu.id);
        throw new Error(`Gagal simpan resep: ${recipeError.message}`);
        }

        return newMenu;
    }
}

module.exports = new MenuRepository();