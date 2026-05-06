import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; token?: string } | null;
  const [form, setForm] = useState({ email: state?.email || '', token: state?.token || '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [f]: e.target.value }));
  const focus = (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = '#22c55e';
  const blur = (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = '#e5e7eb';

  const inputStyle = { width: '100%', padding: '11px 14px', fontSize: 14, background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 10, outline: 'none', color: '#111', boxSizing: 'border-box' as const, fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: 0.4 };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Şifreler eşleşmiyor.'); return; }
    setLoading(true);
    try { await resetPassword(form.email, form.token, form.password, form.confirmPassword); navigate('/login'); }
    catch { setError('Şifre sıfırlama başarısız.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔑</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', marginBottom: 4 }}>Yeni Şifre Belirle</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}><label style={labelStyle}>E-posta</label><input type="email" style={inputStyle} value={form.email} onChange={set('email')} onFocus={focus} onBlur={blur} required /></div>
            <div style={{ marginBottom: 12 }}><label style={labelStyle}>Token</label><input style={inputStyle} value={form.token} onChange={set('token')} onFocus={focus} onBlur={blur} required /></div>
            <div style={{ marginBottom: 12 }}><label style={labelStyle}>Yeni Şifre</label><input type="password" style={inputStyle} value={form.password} onChange={set('password')} onFocus={focus} onBlur={blur} required placeholder="••••••••" /></div>
            <div style={{ marginBottom: 20 }}><label style={labelStyle}>Şifre Tekrar</label><input type="password" style={inputStyle} value={form.confirmPassword} onChange={set('confirmPassword')} onFocus={focus} onBlur={blur} required placeholder="••••••••" /></div>
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: 13, fontSize: 15, fontWeight: 700, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}>
              {loading ? 'Kaydediliyor...' : 'Şifreyi Değiştir →'}
            </button>
          </form>
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <Link to="/login" style={{ fontSize: 13, color: '#22c55e', textDecoration: 'none', fontWeight: 500 }}>← Giriş sayfasına dön</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
