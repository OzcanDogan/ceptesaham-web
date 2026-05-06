import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-png.png';

const features = [
  {
    icon: '📅',
    title: 'Rezervasyon Yönetimi',
    desc: 'Sahanıza gelen tüm rezervasyonları tek ekrandan takip edin. Tarih bazlı görüntüleme ve filtreleme ile düzenli kalın.',
  },
  {
    icon: '⏰',
    title: 'Zaman Dilimi Kontrolü',
    desc: 'Hangi saatlerin açık hangilerinin kapalı olduğunu kolayca yönetin. Tek tıkla dilim açıp kapatın.',
  },
  {
    icon: '📊',
    title: 'Anlık Dashboard',
    desc: 'Günlük rezervasyon sayısı, toplam gelir ve saha durumunu tek bakışta görün.',
  },
  {
    icon: '📸',
    title: 'Saha Fotoğrafları',
    desc: 'Sahanızın fotoğraflarını yükleyin, oyuncuların sahanızı daha iyi tanımasını sağlayın.',
  },
  {
    icon: '💰',
    title: 'Cüzdan Sistemi',
    desc: 'Dijital ödeme ve bakiye takibi ile nakit karmaşasına son verin.',
  },
  {
    icon: '🏆',
    title: 'Topluluk Maçları',
    desc: 'Oyuncular sahanızda topluluk maçları organize edebilir. Doluluk oranınızı artırın.',
  },
];

const stats = [
  { value: '500+', label: 'Kayıtlı Saha' },
  { value: '10K+', label: 'Aktif Oyuncu' },
  { value: '50K+', label: 'Tamamlanan Maç' },
  { value: '99%', label: 'Memnuniyet' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: 'inherit' }}>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logo} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <span style={{ fontSize: 18, fontWeight: 900, color: '#0f1117', letterSpacing: -0.5 }}>
            Cepte<span style={{ color: '#22c55e' }}>Saham</span>
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: '#22c55e', color: '#fff', border: 'none',
            borderRadius: 10, padding: '9px 22px', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
          }}
        >
          Giriş Yap
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #0f1117 0%, #1a2e1a 60%, #0f1117 100%)',
        padding: '96px 32px 80px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 20% 50%, rgba(34,197,94,0.12) 0%, transparent 55%), radial-gradient(circle at 80% 30%, rgba(16,163,74,0.08) 0%, transparent 50%)',
        }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.3)', borderRadius: 999,
            padding: '5px 16px', fontSize: 13, fontWeight: 600, color: '#4ade80', marginBottom: 28,
          }}>
            🏟️ Saha Sahipleri İçin Profesyonel Panel
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900,
            color: '#fff', lineHeight: 1.1, letterSpacing: -2, marginBottom: 22,
          }}>
            Sahanı Yönet,<br />
            <span style={{ color: '#22c55e' }}>Gelirinizi Artır</span>
          </h1>

          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7,
            maxWidth: 520, margin: '0 auto 40px',
          }}>
            CepteSaham ile halı sahanızı dijitale taşıyın. Rezervasyon takibi, zaman dilimi yönetimi ve daha fazlası tek platformda.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: '#22c55e', color: '#fff', border: 'none',
                borderRadius: 14, padding: '16px 36px', fontSize: 16, fontWeight: 800,
                cursor: 'pointer', letterSpacing: -0.3,
                boxShadow: '0 6px 24px rgba(34,197,94,0.4)',
              }}
            >
              Hemen Başla →
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: 14, padding: '16px 36px', fontSize: 16, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          padding: '40px 32px',
        }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#22c55e', letterSpacing: -1 }}>{value}</div>
              <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0f1117', letterSpacing: -1, marginBottom: 12 }}>
            İhtiyacınız olan her şey
          </h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
            Sahanızı verimli yönetmek için tasarlanmış kapsamlı araçlar.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {features.map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: '#fff', borderRadius: 20, padding: 28,
              border: '1.5px solid #f0f0f0',
              boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#22c55e';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(34,197,94,0.12)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#f0f0f0';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f1117', marginBottom: 8, letterSpacing: -0.3 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        margin: '0 32px 80px', borderRadius: 28,
        background: 'linear-gradient(135deg, #0f1117 0%, #1a2e1a 100%)',
        padding: '72px 32px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.1) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: -1.5, marginBottom: 16 }}>
            Sahanızı dijitale taşıyın
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', marginBottom: 36 }}>
            Ücretsiz kaydolun, dakikalar içinde başlayın.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#22c55e', color: '#fff', border: 'none',
              borderRadius: 14, padding: '16px 40px', fontSize: 16, fontWeight: 800,
              cursor: 'pointer', boxShadow: '0 6px 24px rgba(34,197,94,0.4)',
              letterSpacing: -0.3,
            }}
          >
            Hemen Başla →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #e5e7eb', padding: '28px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={logo} alt="Logo" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>
            Cepte<span style={{ color: '#22c55e' }}>Saham</span>
          </span>
        </div>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>© 2025 CepteSaham. Tüm hakları saklıdır.</span>
        <button
          onClick={() => navigate('/login')}
          style={{ background: 'none', border: 'none', color: '#22c55e', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
        >
          Giriş Yap →
        </button>
      </footer>
    </div>
  );
}
