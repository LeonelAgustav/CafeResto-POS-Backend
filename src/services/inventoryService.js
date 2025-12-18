const menuRepository = require('../repositories/menuRepository');
const supabase = require('../config/supabase');

class InventoryService {

    /**
     * Menghitung total bahan baku yang dibutuhkan untuk sebuah order.
     * @param {Array} orderItems - Contoh: [{ menuId: 1, qty: 2 }]
     */
    async calculateRequirements(orderItems) {
        const menuIds = orderItems.map(item => item.menuId);
        
        // 1. Ambil Resep
        const recipes = await menuRepository.getRecipesByMenuIds(menuIds);
        
        // DEBUG LOG: Lihat apa yang dikasih Supabase
        console.log(`[DEBUG] Recipes Found: ${recipes?.length || 0}`);

        const ingredientNeeds = {};

        orderItems.forEach(item => {
        const itemRecipes = recipes.filter(r => r.menu_item_id == item.menuId);

        itemRecipes.forEach(recipe => {
            
            // --- PENANGKAL ERROR (FIX) ---
            // Jika ingredient null, berarti RLS memblokir atau data korup
            if (!recipe.ingredient) {
                console.error("⚠️ DATA ERROR DETECTED:");
                console.error("- Menu ID:", item.menuId);
                console.error("- Recipe Data:", JSON.stringify(recipe));
                console.error("- Penyebab: Kemungkinan besar Config Supabase masih pakai Key Anon/Public, bukan Service Key.");
                
                // Kita skip saja biar server tidak mati, tapi log error
                return; 
            }
            // -----------------------------

            // Baris 27 yang tadi error, sekarang aman karena sudah dicek di atas
            const ingId = recipe.ingredient.id; 
            
            const qtyPerUnit = recipe.quantity_required;
            const totalForThisItem = qtyPerUnit * item.qty;

            if (!ingredientNeeds[ingId]) {
            ingredientNeeds[ingId] = {
                id: ingId,
                name: recipe.ingredient.name,
                currentStock: recipe.ingredient.current_stock,
                totalNeeded: 0,
                unit: recipe.ingredient.unit
            };
            }
            ingredientNeeds[ingId].totalNeeded += totalForThisItem;
        });
        });

        return Object.values(ingredientNeeds);
    }

    /**
     * Mengembalikan stok (Reversal) karena pembatalan/kegagalan order.
     */
    async restoreStock(orderId, items) {
        // 1. Hitung ulang kebutuhan bahan (sama seperti saat deduct)
        const requirements = await this.calculateRequirements(items);

        for (const req of requirements) {
        // 2. Tambah stok kembali
        // (Kita tidak punya 'current_stock' terbaru di var 'req', 
        // tapi kita bisa langsung pakai increment sql query atau fetch dulu. 
        // Supabase tidak punya atomic increment yg mudah via JS client tanpa RPC, 
        // jadi kita fetch-update manual (optimistic locking level basic))
        
        // Ambil stok terbaru dulu
        const { data: currentIng } = await supabase
            .from('ingredients')
            .select('current_stock')
            .eq('id', req.id)
            .single();
            
        if (!currentIng) continue; // Skip jika bahan dihapus (edge case)

        const restoredStock = currentIng.current_stock + req.totalNeeded;

        // Update DB
        await supabase
            .from('ingredients')
            .update({ current_stock: restoredStock })
            .eq('id', req.id);

        // Catat Log Pengembalian
        await supabase
            .from('inventory_logs')
            .insert({
            ingredient_id: req.id,
            quantity_change: req.totalNeeded, // Positif (Masuk lagi)
            reason: `Reversal Order ${orderId}` // Reason penting!
            });
        }
        return true;
    }

    /**
     * Menambah/Mengurangi stok secara manual (Restock atau Waste)
     * @param {number} ingredientId 
     * @param {number} qtyChange - Positif untuk masuk, Negatif untuk keluar/waste
     * @param {string} reason - e.g., "Belanja Pasar", "Barang Kadaluarsa"
     */
    async adjustStock(ingredientId, qtyChange, reason) {
        // 1. Ambil data stok sekarang
        const { data: currentIng, error } = await supabase
        .from('ingredients')
        .select('current_stock, name')
        .eq('id', ingredientId)
        .single();

        if (error || !currentIng) throw new Error(`Bahan baku ID ${ingredientId} tidak ditemukan.`);

        const newStock = parseFloat(currentIng.current_stock) + parseFloat(qtyChange);

        // 2. Update Database
        const { error: updateError } = await supabase
        .from('ingredients')
        .update({ current_stock: newStock })
        .eq('id', ingredientId);

        if (updateError) throw new Error("Gagal update stok database.");

        // 3. Catat Log (PENTING!)
        await supabase
        .from('inventory_logs')
        .insert({
            ingredient_id: ingredientId,
            quantity_change: qtyChange,
            reason: reason
        });

        return { 
        ingredient: currentIng.name, 
        oldStock: currentIng.current_stock, 
        newStock: newStock 
        };
    }
}

module.exports = new InventoryService();