import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api/auth';
import logo from '../../assets/logo-png.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      const token = data.jWToken ?? data.jwToken ?? data.JWToken ?? data.token;
      if (!token) throw new Error('Token alınamadı');
      await signIn(token);
      if (data.userType === 'BusinessOwner') navigate('/business/dashboard');
      else navigate('/player/fields');
    } catch {
      setError('E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sol panel */}
      <div style={{
        width: '50%', background: '#0f1117',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden'
      }} className="hidden lg:flex">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 40%, rgba(34,197,94,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(16,163,74,0.1) 0%, transparent 50%)'
        }} />
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={logo} alt="CepteSaham Logo" style={{ width: 250, height: 250, marginBottom: 12, objectFit: 'contain', display: 'block' }} />
          <h1 style={{ fontSize: 42, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16, letterSpacing: -1.5 }}>
            Cepte<span style={{ color: '#22c55e' }}>Saham</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.6, marginBottom: 40 }}>
            Halı sahanı bul, maçını planla, oyuncularla buluş.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[['500+', 'Saha'], ['10K+', 'Oyuncu'], ['50K+', 'Maç']].map(([val, label]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#22c55e' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: '#f5f5f7' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f1117', marginBottom: 4, letterSpacing: -0.5 }}>Hoş Geldin 👋</h2>
              <p style={{ fontSize: 14, color: '#6b7280' }}>Hesabına giriş yap</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="ornek@email.com"
                  style={{
                    width: '100%', padding: '11px 14px', fontSize: 14,
                    background: '#f9fafb', border: '1.5px solid #e5e7eb',
                    borderRadius: 12, outline: 'none', color: '#111',
                    boxSizing: 'border-box', transition: 'border-color 0.15s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#22c55e'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Şifre</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '11px 44px 11px 14px', fontSize: 14,
                      background: '#f9fafb', border: '1.5px solid #e5e7eb',
                      borderRadius: 12, outline: 'none', color: '#111',
                      boxSizing: 'border-box', transition: 'border-color 0.15s'
                    }}
                    onFocus={e => e.target.style.borderColor = '#22c55e'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}
                  >
                    <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} style={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px', fontSize: 15, fontWeight: 700,
                  background: loading ? '#86efac' : '#22c55e',
                  color: '#fff', border: 'none', borderRadius: 12,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(34,197,94,0.35)',
                  transition: 'all 0.15s', letterSpacing: -0.2
                }}
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
              </button>
            </form>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#22c55e', textDecoration: 'none', fontWeight: 500 }}>
                Şifremi unuttum
              </Link>
            </div>
            <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
              Hesabın yok mu?{' '}
              <Link to="/register" style={{ color: '#22c55e', fontWeight: 700, textDecoration: 'none' }}>Kayıt Ol</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
