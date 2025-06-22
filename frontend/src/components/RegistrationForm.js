import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{16,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password harus 16+ karakter dengan kombinasi huruf besar/kecil, angka, dan simbol');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify`,
          data: {
            full_name: formData.fullName
          }
        }
      });

      if (error) throw error;
      
      navigate('/verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{16,}$"
          title="Minimal 16 karakter dengan kombinasi huruf besar, kecil, angka, dan simbol"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          disabled={loading}
          required
        />
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </div>
    </form>
  );
}