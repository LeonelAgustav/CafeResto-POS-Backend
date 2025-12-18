const supabase = require('../config/supabase');

class OrderRepository {

    // 1. Buat Header Order (Data Utama)
    async createOrderHeader(userId, totalAmount, paymentMethod) {
        const { data, error } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                total_amount: totalAmount,
                status: 'pending',
                payment_method: paymentMethod
            })
            .select()
            .single(); // Minta balikan 1 baris data yang baru dibuat

        if (error) throw new Error(`Gagal buat Order: ${error.message}`);
        return data;
    }

    // 2. Buat Detail Item Order
    async createOrderItems(orderId, itemsWithPrice) {
        // Mapping data agar sesuai nama kolom di DB
        const payload = itemsWithPrice.map(item => ({
            order_id: orderId,
            menu_item_id: item.menuId,
            quantity: item.qty,
            price_snapshot: item.price, // Harga saat ini
            cogs_snapshot: 0 // Nanti dihitung dari total harga bahan
        }));

        const { error } = await supabase
            .from('order_items')
            .insert(payload);

        if (error) throw new Error(`Gagal simpan item: ${error.message}`);
        return true;
    }

    // Ambil Order Header
    async getOrderById(orderId) {
        return await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
    }

    // Ambil Order Items
    async getOrderItems(orderId) {
        const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
        
        if (error) throw new Error(error.message);
        return data;
    }

    // Update Status
    async updateStatus(orderId, newStatus) {
        const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        if (error) throw new Error(error.message);
        return true;
    }
}

module.exports = new OrderRepository();