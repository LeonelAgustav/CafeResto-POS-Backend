const inventoryService = require('../services/inventoryService');
const orderRepository = require('../repositories/orderRepository');
const menuRepository = require('../repositories/menuRepository');
const { checkoutSchema } = require('../utils/validators');

class OrderController {

   async createOrder(req, res) {
        try {
        // 1. VALIDASI INPUT (Layer Pertama)
        const { error, value } = checkoutSchema.validate(req.body);
        
        if (error) {
            // Jika input sampah, tolak langsung. Jangan ganggu database.
            return res.status(400).json({ 
            status: 'VALIDATION_ERROR', 
            message: error.details[0].message 
            });
        }

        // Gunakan data yang sudah divalidasi (value), bukan req.body lagi
        const { items, paymentMethod } = value;
        // items format: [{ menuId: 1, qty: 2 }]

        if (!items || items.length === 0) throw new Error("Keranjang kosong!");

        // --- STEP 1: VALIDASI STOK (Read) ---
        // Variable stockCheck ini PENTING, jangan dihapus!
        const stockCheck = await inventoryService.checkStockAvailability(items);

        // --- STEP 2: HITUNG TOTAL HARGA (SECURE) ---
        // Ambil harga asli dari database (Anti-Cheat)
        const ids = items.map(i => i.menuId);
        const dbMenus = await menuRepository.getMenuPrices(ids);
        
        let totalAmount = 0;
        
        // Map ulang items dengan harga dari DB
        const itemsWithPrice = items.map(item => {
            const menuData = dbMenus.find(m => m.id === item.menuId);
            
            if (!menuData) throw new Error(`Menu ID ${item.menuId} tidak ditemukan!`);
            
            const price = menuData.base_price;
            totalAmount += price * item.qty;
            
            return { 
            ...item, 
            price: price, // Harga snapshot untuk disimpan ke DB
            name: menuData.name 
            };
        });

        // --- STEP 3: BUAT ORDER (Write) ---
        const newOrder = await orderRepository.createOrderHeader(null, totalAmount, paymentMethod);
        const orderId = newOrder.id;

        // --- STEP 4: SIMPAN ITEM ORDER (Write) ---
        await orderRepository.createOrderItems(orderId, itemsWithPrice);

        // --- STEP 5: POTONG STOK (Write - Critical) ---
        // Kita butuh variable 'stockCheck' dari Step 1 di sini
        await inventoryService.deductStock(stockCheck.requirements, newOrder.order_number || orderId);

        // --- SUKSES ---
        res.json({
            status: 'SUCCESS',
            message: 'Order berhasil dibuat & Stok terpotong.',
            data: {
            orderId: orderId,
            total: totalAmount
            }
        });

        } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'FAILED',
            error: err.message
        });
        }
    }

    async cancelOrder(req, res) {
        try {
        const { orderId } = req.params;
        
        // 1. Cek Status Order dulu
        const { data: order, error } = await orderRepository.getOrderById(orderId);
        if (error || !order) throw new Error("Order tidak ditemukan");
        
        if (order.status !== 'pending') {
            throw new Error("Hanya order pending yang bisa dibatalkan & di-refund stoknya.");
        }

        // 2. Ambil Item Order tersebut (untuk tahu apa yang harus dibalikin)
        // Kita perlu nambah fungsi di Repository untuk ambil items by orderId (Next step)
        // Anggap function ini ada: orderRepository.getOrderItems(orderId)
        const orderItems = await orderRepository.getOrderItems(orderId); 
        
        // Format ulang agar cocok dengan logic inventoryService (map DB columns ke object service)
        const formattedItems = orderItems.map(item => ({
            menuId: item.menu_item_id,
            qty: item.quantity
        }));

        // 3. Kembalikan Stok (Reversal)
        await inventoryService.restoreStock(orderId, formattedItems);

        // 4. Update Status Order jadi Cancelled
        await orderRepository.updateStatus(orderId, 'cancelled');

        res.json({ status: 'SUCCESS', message: 'Order dibatalkan & Stok dikembalikan.' });

        } catch (err) {
        res.status(400).json({ error: err.message });
        }
    }
}

module.exports = new OrderController();