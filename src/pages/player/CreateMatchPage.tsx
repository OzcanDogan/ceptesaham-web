import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllFields } from '../../api/footballField';
import { getMyReservations } from '../../api/reservations';
import { createPublicMatch } from '../../api/publicMatch';
import { FootballField, ReservationDto } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import '../../components/layout.css';

const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', fontSize: 14, background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 10, outline: 'none', color: '#111', boxSizing: 'border-box', fontFamily: 'inherit' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 };
const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => e.target.style.borderColor = '#22c55e';
const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => e.target.style.borderColor = '#e5e7eb';

export default function CreateMatchPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState<FootballField[]>([]);
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', description: '', teamSize: 5, footballFieldId: 0, reservationId: 0 });

  useEffect(() => {
    Promise.all([getAllFields(), getMyReservations()]).then(([f, r]) => {
      setFields(f);
      setReservations(r.activeReservations || []);
      if (f.length > 0) setForm(fr => ({ ...fr, footballFieldId: f[0].id }));
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = { title: form.title, description: form.description, teamSize: form.teamSize, footballFieldId: form.footballFieldId || undefined, reservationId: form.reservationId || undefined };
      const match = await createPublicMatch(payload);
      navigate(`/player/matches/${match.id}`);
    } catch {
      setMsg('Maç oluşturulamadı.');
      setSaving(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14, fontWeight: 500, marginBottom: 20, padding: 0 }}>
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 18 }} /> Geri
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: '0 0 24px' }}>Maç Oluştur</h1>

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)', padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={lbl}>Maç Başlığı</label>
          <input style={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} onFocus={focus} onBlur={blur} required placeholder="5x5 Maç – Kadıköy" />
        </div>

        <div>
          <label style={lbl}>Açıklama</label>
          <textarea style={{ ...inp, resize: 'none', height: 90 } as React.CSSProperties} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} onFocus={focus} onBlur={blur} placeholder="Maç hakkında bilgi..." />
        </div>

        <div>
          <label style={lbl}>Takım Büyüklüğü</label>
          <select style={inp} value={form.teamSize} onChange={e => setForm(f => ({ ...f, teamSize: Number(e.target.value) }))} onFocus={focus} onBlur={blur}>
            {[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}x{n}</option>)}
          </select>
        </div>

        <div>
          <label style={lbl}>Saha</label>
          <select style={inp} value={form.footballFieldId} onChange={e => setForm(f => ({ ...f, footballFieldId: Number(e.target.value) }))} onFocus={focus} onBlur={blur}>
            <option value={0}>Saha seç...</option>
            {fields.map(f => <option key={f.id} value={f.id}>{f.fieldName} – {f.cityName}</option>)}
          </select>
        </div>

        {reservations.length > 0 && (
          <div>
            <label style={lbl}>Rezervasyona Bağla (Opsiyonel)</label>
            <select style={inp} value={form.reservationId} onChange={e => setForm(f => ({ ...f, reservationId: Number(e.target.value) }))} onFocus={focus} onBlur={blur}>
              <option value={0}>Seçme</option>
              {reservations.map(r => <option key={r.id} value={r.id}>{r.footballFieldName} – {r.date} {r.startTime}</option>)}
            </select>
          </div>
        )}

        {msg && <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>{msg}</p>}

        <button type="submit" disabled={saving} style={{ padding: 14, background: saving ? '#86efac' : '#22c55e', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.35)' }}>
          {saving ? 'Oluşturuluyor...' : 'Maç Oluştur →'}
        </button>
      </form>
    </div>
  );
}
