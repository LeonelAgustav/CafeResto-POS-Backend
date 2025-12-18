const supabase = require('../config/supabase');

class AuthController {
  
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email dan Password wajib diisi' });
      }

      // 1. Minta Token ke Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        return res.status(401).json({ error: 'Login Gagal: Email atau Password salah' });
      }

      // 2. Ambil Role User dari tabel user_roles (Opsional, untuk info tambahan)
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      // 3. Return Token & User Info
      res.json({
        status: 'SUCCESS',
        message: 'Login Berhasil',
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            role: roleData?.role || 'staff' // Default staff jika belum diset
          },
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in
          }
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new AuthController();