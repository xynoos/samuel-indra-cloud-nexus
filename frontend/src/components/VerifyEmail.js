import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      navigate('/login');
    }
  }

  return (
    <div>
      <h2>Verifikasi Email Dibutuhkan</h2>
      <p>Silakan cek email Anda untuk tautan verifikasi. Setelah verifikasi berhasil, Anda bisa login.</p>
    </div>
  );
}