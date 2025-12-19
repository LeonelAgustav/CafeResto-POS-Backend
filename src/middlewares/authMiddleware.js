const supabase = require('../config/supabase');

/**
 * Middleware untuk memverifikasi Token Supabase.
 * Client (Flutter) wajib kirim Header: 
 * Authorization: Bearer <TOKEN_JWT_DARI_SUPABASE_LOGIN>
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Akses Ditolak: Butuh Token Auth!' });
    }

    const token = authHeader.split(' ')[1]; // Ambil token setelah kata 'Bearer'

    // Verifikasi Token ke Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: 'Token Tidak Valid atau Kadaluarsa' });
    }

    // Sukses: Tempel data user ke request object agar bisa dipakai di Controller
    req.user = user;
    
    // Cek Role (Optional, nanti bisa dikembangkan untuk membedakan Kasir vs Owner)
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
    req.role = roleData?.role;

    next(); // Lanjut ke Controller

  } catch (err) {
    res.status(500).json({ error: 'Internal Auth Error' });
  }
};

module.exports = requireAuth;