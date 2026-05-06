import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ token?: string } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try { const data = await forgotPassword(email); setResult(data); }
    catch { setError('E-posta bulunamadı.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {result ? (
          <div style={{ background: '#fff', borderRadius: 24, padding: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f1117', marginBottom: 8 }}>Token Alındı</h2>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Demo mod: Token aşağıda görüntüleniyor</p>
            {result.token && (
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
                <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Sıfırlama Token'ı</p>
                <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#374151', wordBreak: 'break-all' }}>{result.token}</p>
              </div>
            )}
            <button onClick={() => navigate('/reset-password', { state: { email, token: result.token } })}
              style={{ width: '100%', padding: 13, fontSize: 15, fontWeight: 700, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}>
              Şifreyi Sıfırla →
            </button>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 24, padding: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', marginBottom: 4 }}>Şifremi Unuttum</h2>
              <p style={{ fontSize: 13, color: '#9ca3af' }}>E-posta adresinizi girin</p>
            </div>
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>E-posta</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ornek@email.com"
                style={{ width: '100%', padding: '11px 14px', fontSize: 14, background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 10, outline: 'none', color: '#111', boxSizing: 'border-box', marginBottom: 16, fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = '#22c55e'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ width: '100%', padding: 13, fontSize: 15, fontWeight: 700, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}>
                {loading ? 'Gönderiliyor...' : 'Token Gönder →'}
              </button>
            </form>
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <Link to="/login" style={{ fontSize: 13, color: '#22c55e', textDecoration: 'none', fontWeight: 500 }}>← Geri dön</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
