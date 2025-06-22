import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            username: formData.username
          }
        }
      });

      if (error) throw error;
      
      if (!data.user?.confirmation_sent_at) {
        throw new Error('Gagal mengirim email verifikasi');
      }

      alert('Email verifikasi telah dikirim! Silakan cek inbox Anda');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label>Nama Lengkap</label>
        <input
          type="text"
          required
          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Username</label>
        <input
          type="text"
          required
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          required
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          required
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Memproses...' : 'Daftar'}
      </button>
    </form>
  );
}