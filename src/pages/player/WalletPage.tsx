import React, { useEffect, useState } from 'react';
import { getWalletBalance, getWalletTransactions, depositToWallet, withdrawFromWallet } from '../../api/wallet';
import { WalletDto, WalletTransactionDto } from '../../types';
import { Wallet, ArrowDownCircle, ArrowUpCircle, TrendingUp, Lock } from 'lucide-react';

function txTypeLabel(type: string) {
  const map: Record<string, string> = {
    Deposit: 'Para Yatırma',
    Hold: 'Beklemede',
    Release: 'İade',
    Transfer: 'Transfer',
  };
  return map[type] || type;
}

function txColor(type: string) {
  return type === 'Deposit' || type === 'Release' ? 'text-green-600' : 'text-red-600';
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletDto | null>(null);
  const [txs, setTxs] = useState<WalletTransactionDto[]>([]);
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'deposit' | 'withdraw' | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const [w, t] = await Promise.all([getWalletBalance(), getWalletTransactions()]);
    setWallet(w);
    setTxs(t);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleAction = async () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    setActionLoading(true);
    setMsg('');
    try {
      if (mode === 'deposit') {
        const w = await depositToWallet(n);
        setWallet(w);
        setMsg('Para yatırıldı!');
      } else {
        const w = await withdrawFromWallet(n);
        setWallet(w);
        setMsg('Para çekildi!');
      }
      setAmount('');
      setMode(null);
      await load();
    } catch {
      setMsg('İşlem başarısız. Bakiyenizi kontrol edin.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cüzdan</h1>

      {wallet && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-600 text-white rounded-2xl p-5 col-span-3 md:col-span-1">
            <Wallet size={24} className="mb-2 opacity-80" />
            <p className="text-green-100 text-sm">Toplam Bakiye</p>
            <p className="text-3xl font-bold">₺{wallet.balance.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <Lock size={20} className="text-orange-500 mb-2" />
            <p className="text-gray-500 text-sm">Beklemede</p>
            <p className="text-xl font-bold text-gray-800">₺{wallet.heldBalance.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <TrendingUp size={20} className="text-green-500 mb-2" />
            <p className="text-gray-500 text-sm">Kullanılabilir</p>
            <p className="text-xl font-bold text-gray-800">₺{wallet.availableBalance.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode(mode === 'deposit' ? null : 'deposit')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition ${mode === 'deposit' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border border-green-300 hover:bg-green-50'}`}
        >
          <ArrowDownCircle size={18} /> Para Yatır
        </button>
        <button
          onClick={() => setMode(mode === 'withdraw' ? null : 'withdraw')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition ${mode === 'withdraw' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-300 hover:bg-red-50'}`}
        >
          <ArrowUpCircle size={18} /> Para Çek
        </button>
      </div>

      {mode && (
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-100">
          <p className="font-semibold text-gray-700 mb-3">
            {mode === 'deposit' ? 'Yatırılacak Tutar' : 'Çekilecek Tutar'}
          </p>
          <div className="flex gap-3">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleAction}
              disabled={actionLoading}
              className={`px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-50 ${mode === 'deposit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {actionLoading ? '...' : 'Onayla'}
            </button>
          </div>
          {msg && (
            <p className={`mt-3 text-sm font-medium ${msg.includes('başarısız') ? 'text-red-600' : 'text-green-600'}`}>
              {msg}
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">İşlem Geçmişi</h2>
        </div>
        {txs.length === 0 ? (
          <p className="text-center text-gray-400 py-8">İşlem yok</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {txs.map(tx => (
              <div key={tx.id} className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{txTypeLabel(tx.type)}</p>
                  <p className="text-xs text-gray-400">{tx.description}</p>
                  <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
                <span className={`font-bold ${txColor(tx.type)}`}>
                  {tx.type === 'Deposit' || tx.type === 'Release' ? '+' : '-'}₺{Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
