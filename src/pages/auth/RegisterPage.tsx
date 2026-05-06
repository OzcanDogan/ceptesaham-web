import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, login } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import LocationPicker, { LocationValue } from '../../components/LocationPicker';
import logo from '../../assets/logo-png.png';

const s = {
  input: {
    width: '100%', padding: '11px 14px', fontSize: 14,
    background: '#f9fafb', border: '1.5px solid #e5e7eb',
    borderRadius: 10, outline: 'none', color: '#111',
    boxSizing: 'border-box' as const, transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 0.4 },
};

export default function RegisterPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phoneNumber: '', tcKimlik: '', userType: 'BusinessOwner' as const,
  });
  const [location, setLocation] = useState<LocationValue>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Şifreler eşleşmiyor.'); return; }
    setError(''); setLoading(true);
    try {
      await register({ ...form, ...location });
      const data = await login({ email: form.email, password: form.password });
      const token = data.jWToken ?? data.jwToken ?? data.JWToken ?? data.token;
      if (!token) throw new Error('Token alınamadı');
      await signIn(token);
      navigate('/business/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Kayıt başarısız.');
    } finally { setLoading(false); }
  };

  const focus = (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = '#22c55e';
  const blur = (e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = '#e5e7eb';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f7' }}>
      {/* Sol dekor */}
      <div style={{ width: '42%', background: '#0f1117', display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, position: 'relative', overflow: 'hidden' }}
        className="hidden lg:flex">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 40%, rgba(34,197,94,0.15) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <img src={logo} alt="CepteSaham Logo" style={{ width: 120, height: 120, marginBottom: 20, objectFit: 'contain' }} />
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>CepteSaham'a<br /><span style={{ color: '#22c55e' }}>Katıl</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, marginTop: 12, lineHeight: 1.6 }}>Binlerce oyuncuyla maç yap, en iyi sahayı bul.</p>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 500 }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', marginBottom: 4, letterSpacing: -0.5 }}>Hesap Oluştur</h2>
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>Birkaç saniyede kayıt ol</p>

            <div style={{ background: '#f0fdf4', border: '1.5px solid #22c55e', borderRadius: 12, padding: '10px 16px', marginBottom: 20, fontSize: 13, fontWeight: 600, color: '#16a34a' }}>
              🏟️ Saha Sahibi olarak kayıt oluyorsunuz
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><label style={s.label}>Ad</label><input style={s.input} value={form.firstName} onChange={set('firstName')} onFocus={focus} onBlur={blur} required placeholder="Adınız" /></div>
                <div><label style={s.label}>Soyad</label><input style={s.input} value={form.lastName} onChange={set('lastName')} onFocus={focus} onBlur={blur} required placeholder="Soyadınız" /></div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={s.label}>E-posta</label>
                <input type="email" style={s.input} value={form.email} onChange={set('email')} onFocus={focus} onBlur={blur} required placeholder="ornek@email.com" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><label style={s.label}>Telefon</label><input style={s.input} value={form.phoneNumber} onChange={set('phoneNumber')} onFocus={focus} onBlur={blur} required placeholder="05xx xxx xx xx" /></div>
                <div><label style={s.label}>TC Kimlik</label><input style={s.input} value={form.tcKimlik} onChange={set('tcKimlik')} onFocus={focus} onBlur={blur} required maxLength={11} placeholder="11 hane" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><label style={s.label}>Şifre</label><input type="password" style={s.input} value={form.password} onChange={set('password')} onFocus={focus} onBlur={blur} required placeholder="••••••••" /></div>
                <div><label style={s.label}>Şifre Tekrar</label><input type="password" style={s.input} value={form.confirmPassword} onChange={set('confirmPassword')} onFocus={focus} onBlur={blur} required placeholder="••••••••" /></div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={s.label}>Bulunduğunuz Bölge</label>
                <LocationPicker value={location} onChange={setLocation} />
              </div>

              {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>{error}</div>}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: 13, fontSize: 15, fontWeight: 700,
                background: loading ? '#86efac' : '#22c55e', color: '#fff',
                border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(34,197,94,0.35)', letterSpacing: -0.2,
              }}>
                {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol →'}
              </button>
            </form>

            <p style={{ marginTop: 18, textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
              Hesabın var mı?{' '}
              <Link to="/login" style={{ color: '#22c55e', fontWeight: 700, textDecoration: 'none' }}>Giriş Yap</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
