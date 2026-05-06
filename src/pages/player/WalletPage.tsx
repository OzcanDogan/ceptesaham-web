import React, { useEffect, useState } from 'react';
import { getWalletBalance, getWalletTransactions, depositToWallet, withdrawFromWallet } from '../../api/wallet';
import { WalletDto, WalletTransactionDto } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faLock, faChartLine, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import '../../components/layout.css';

function txIsIncoming(type: string) { return type === 'Deposit' || type === 'Release'; }
function txLabel(type: string) {
  const map: Record<string, string> = { Deposit: 'Para Yatırma', Hold: 'Beklemede', Release: 'İade', Transfer: 'Transfer', Withdraw: 'Para Çekme' };
  return map[type] || type;
}

const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', fontSize: 14, background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 10, outline: 'none', color: '#111', boxSizing: 'border-box', fontFamily: 'inherit' };

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletDto | null>(null);
  const [txs, setTxs] = useState<WalletTransactionDto[]>([]);
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'deposit' | 'withdraw' | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState<{text: string; type: 'success'|'error'} | null>(null);

  const load = async () => {
    const [w, t] = await Promise.all([getWalletBalance(), getWalletTransactions()]);
    setWallet(w); setTxs(t);
  };

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const handleAction = async () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    setActionLoading(true); setMsg(null);
    try {
      const w = mode === 'deposit' ? await depositToWallet(n) : await withdrawFromWallet(n);
      setWallet(w);
      setMsg({ text: mode === 'deposit' ? 'Para başarıyla yatırıldı!' : 'Para başarıyla çekildi!', type: 'success' });
      setAmount(''); setMode(null);
      await load();
    } catch {
      setMsg({ text: 'İşlem başarısız. Bakiyenizi kontrol edin.', type: 'error' });
    } finally { setActionLoading(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><div className="spinner" /></div>
  );

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>Cüzdan</h1>
        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Bakiyenizi yönetin</p>
      </div>

      {/* Balance card */}
      {wallet && (
        <div style={{ background: 'linear-gradient(135deg, #0f1117, #1a2e1a)', borderRadius: 24, padding: 28, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(34,197,94,0.2) 0%, transparent 50%)' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ color: '#86efac', fontSize: 13, fontWeight: 500, margin: '0 0 4px' }}>Toplam Bakiye</p>
            <p style={{ fontSize: 48, fontWeight: 900, color: '#fff', margin: '0 0 24px', letterSpacing: -1 }}>₺{wallet.balance.toFixed(2)}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <FontAwesomeIcon icon={faLock} style={{ color: '#fb923c', fontSize: 13 }} />
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Beklemede</span>
                </div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>₺{wallet.heldBalance.toFixed(2)}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <FontAwesomeIcon icon={faChartLine} style={{ color: '#4ade80', fontSize: 13 }} />
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Kullanılabilir</span>
                </div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>₺{wallet.availableBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => setMode(mode === 'deposit' ? null : 'deposit')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 16, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s', border: 'none', background: mode === 'deposit' ? '#22c55e' : '#fff', color: mode === 'deposit' ? '#fff' : '#374151', boxShadow: mode === 'deposit' ? '0 4px 14px rgba(34,197,94,0.35)' : '0 1px 4px rgba(0,0,0,0.06)', outline: '1.5px solid', outlineColor: mode === 'deposit' ? '#22c55e' : '#e5e7eb' }}
        >
          <FontAwesomeIcon icon={faPlus} style={{ fontSize: 18 }} /> Para Yatır
        </button>
        <button
          onClick={() => setMode(mode === 'withdraw' ? null : 'withdraw')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 16, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s', border: 'none', background: mode === 'withdraw' ? '#ef4444' : '#fff', color: mode === 'withdraw' ? '#fff' : '#374151', boxShadow: mode === 'withdraw' ? '0 4px 14px rgba(239,68,68,0.3)' : '0 1px 4px rgba(0,0,0,0.06)', outline: '1.5px solid', outlineColor: mode === 'withdraw' ? '#ef4444' : '#e5e7eb' }}
        >
          <FontAwesomeIcon icon={faMinus} style={{ fontSize: 18 }} /> Para Çek
        </button>
      </div>

      {mode && (
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 20, marginBottom: 20 }}>
          <p style={{ fontWeight: 700, color: '#0f1117', fontSize: 14, margin: '0 0 12px' }}>{mode === 'deposit' ? 'Yatırılacak Tutar' : 'Çekilecek Tutar'}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontWeight: 700, fontSize: 14 }}>₺</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ ...inp, paddingLeft: 30 }} onFocus={e => e.target.style.borderColor = '#22c55e'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>
            <button
              onClick={handleAction}
              disabled={actionLoading || !amount}
              style={{ padding: '11px 20px', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', border: 'none', background: mode === 'deposit' ? '#22c55e' : '#ef4444', opacity: (actionLoading || !amount) ? 0.5 : 1 }}
            >
              {actionLoading ? '...' : 'Onayla'}
            </button>
          </div>
          {msg && <p style={{ marginTop: 10, fontSize: 13, fontWeight: 500, color: msg.type === 'success' ? '#16a34a' : '#dc2626' }}>{msg.text}</p>}
        </div>
      )}

      {/* Transactions */}
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ fontWeight: 700, color: '#0f1117', fontSize: 15, margin: 0 }}>İşlem Geçmişi</h2>
        </div>
        {txs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
            <p style={{ fontSize: 28, margin: '0 0 8px' }}>💳</p>
            <p style={{ margin: 0 }}>Henüz işlem yok</p>
          </div>
        ) : (
          <div>
            {txs.map(tx => {
              const incoming = txIsIncoming(tx.type);
              return (
                <div key={tx.id} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f9fafb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: incoming ? '#f0fdf4' : '#fef2f2', flexShrink: 0 }}>
                      <FontAwesomeIcon icon={incoming ? faArrowDown : faArrowUp} style={{ color: incoming ? '#22c55e' : '#ef4444', fontSize: 16 }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#0f1117', fontSize: 14, margin: 0 }}>{txLabel(tx.type)}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>{tx.description} · {new Date(tx.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 15, color: incoming ? '#22c55e' : '#ef4444' }}>
                    {incoming ? '+' : '-'}₺{Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
