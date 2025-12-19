/**
 * Middleware untuk memastikan user adalah ADMIN.
 * WAJIB dipasang SETELAH middleware 'requireAuth'.
 */
const requireAdmin = (req, res, next) => {
  // req.role sudah di-set oleh requireAuth sebelumnya
  if (req.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Akses Ditolak: Fitur ini khusus untuk Admin/Manajer.' 
    });
  }
  next();
};

/**
 * Middleware untuk memastikan user adalah KITCHEN (Dapur).
 */
const requireKitchen = (req, res, next) => {
  if (req.role !== 'kitchen' && req.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Akses Ditolak: Fitur ini khusus area Dapur.' 
    });
  }
  next();
};

/**
 * Middleware untuk memastikan user adalah CASHIER (Kasir).
 */
const requireCashier = (req, res, next) => {
  if (req.role !== 'cashier' && req.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Akses Ditolak: Fitur ini khusus Kasir.' 
    });
  }
  next();
};

module.exports = { requireAdmin, requireKitchen, requireCashier };