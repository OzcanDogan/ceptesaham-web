import React, { useEffect, useState } from 'react';
import { getMyField, getAllSlotsByFieldAndDate, toggleOwnerBlock } from '../../api/footballField';
import { FootballField, TimeSlotDto } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarTimes, faCheckCircle, faLock, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import '../../components/layout.css';

const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export default function FieldTimeSlotsPage() {
  const today = new Date();
  const [field, setField] = useState<FootballField | null>(null);
  const [loadingField, setLoadingField] = useState(true);
  const [selectedDate, setSelectedDate] = useState(today);
  const [slots, setSlots] = useState<TimeSlotDto[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [pageError, setPageError] = useState('');

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const getDays = (): Date[] =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });

  const fetchSlots = async (fieldId: number, date: Date) => {
    setLoadingSlots(true);
    setSlots([]);
    try {
      const data = await getAllSlotsByFieldAndDate(fieldId, formatDate(date));
      setSlots(data);
    } catch {
      setPageError('Zaman dilimleri yüklenemedi.');
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    getMyField()
      .then(f => { setField(f); fetchSlots(f.id, today); })
      .catch(() => setPageError('Saha bulunamadı.'))
      .finally(() => setLoadingField(false));
  }, []);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    if (field) fetchSlots(field.id, date);
  };

  const isPastSlot = (startTime: string): boolean => {
    if (formatDate(selectedDate) !== formatDate(today)) return false;
    const [h] = startTime.split(':').map(Number);
    return h <= today.getHours();
  };

  const handleToggleBlock = async (slot: TimeSlotDto) => {
    if (!slot.isAvailable && !slot.isBlockedByOwner) {
      alert('Bu saat dilimi bir oyuncu tarafından rezerve edilmiş.');
      return;
    }
    setTogglingId(slot.id);
    try {
      await toggleOwnerBlock(slot.id);
      setSlots(prev =>
        prev.map(s =>
          s.id === slot.id
            ? { ...s, isBlockedByOwner: !s.isBlockedByOwner, isAvailable: s.isBlockedByOwner }
            : s
        )
      );
    } catch {
      alert('İşlem başarısız. Lütfen tekrar deneyin.');
    } finally {
      setTogglingId(null);
    }
  };

  const visibleSlots = slots.filter(s => !isPastSlot(s.startTime));
  const available    = visibleSlots.filter(s => s.isAvailable).length;
  const blockedOwner = visibleSlots.filter(s => s.isBlockedByOwner).length;
  const reserved     = visibleSlots.filter(s => !s.isAvailable && !s.isBlockedByOwner).length;
  const days = getDays();

  if (loadingField) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><div className="spinner" /></div>
  );

  if (pageError) return (
    <div style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af', fontSize: 15 }}>{pageError}</div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f1117', letterSpacing: -0.5, margin: 0 }}>Zaman Dilimleri</h1>
        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
          {field?.fieldName} · Saat dilimlerine tıklayarak açıp kapatabilirsiniz
        </p>
      </div>

      {/* Gün seçici */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '14px 16px', marginBottom: 16,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)',
        display: 'flex', gap: 8, overflowX: 'auto',
      }}>
        {days.map(day => {
          const isToday    = formatDate(day) === formatDate(today);
          const isSelected = formatDate(day) === formatDate(selectedDate);
          return (
            <button
              key={day.toISOString()}
              onClick={() => handleSelectDate(day)}
              style={{
                minWidth: 58, height: 68, borderRadius: 14, flexShrink: 0,
                border: `1.5px solid ${isSelected ? '#0f1117' : '#e5e7eb'}`,
                background: isSelected ? '#0f1117' : '#fff',
                cursor: 'pointer', padding: '8px 0',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: isSelected ? 'rgba(255,255,255,0.65)' : '#9ca3af' }}>
                {isToday ? 'Bugün' : DAY_NAMES[day.getDay()]}
              </span>
              <span style={{ fontSize: 20, fontWeight: 900, color: isSelected ? '#fff' : '#0f1117' }}>
                {day.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Özet kartlar */}
      {visibleSlots.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Müsait',    count: available,    color: '#22c55e', bg: '#f0fdf4' },
            { label: 'Rezerve',   count: reserved,     color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Kapattınız', count: blockedOwner, color: '#f97316', bg: '#fff7ed' },
          ].map(({ label, count, color, bg }) => (
            <div key={label} style={{
              background: bg, borderRadius: 14, border: `1.5px solid ${color}33`,
              padding: '14px 8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, fontWeight: 900, color }}>{count}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginBottom: 16 }}>
        Rezerve edilmiş saatler değiştirilemez.
      </p>

      {/* Slot listesi */}
      {loadingSlots ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}><div className="spinner" /></div>
      ) : visibleSlots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
          <FontAwesomeIcon icon={faCalendarTimes} style={{ fontSize: 48, marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 15 }}>Bu tarih için uygun saat kalmadı.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visibleSlots.map(slot => {
            const isReservedByPlayer = !slot.isAvailable && !slot.isBlockedByOwner;
            const isToggling = togglingId === slot.id;
            const color = slot.isBlockedByOwner ? '#f97316' : isReservedByPlayer ? '#3b82f6' : '#22c55e';
            const bg    = slot.isBlockedByOwner ? '#fff7ed' : isReservedByPlayer ? '#eff6ff' : '#f0fdf4';
            const label = slot.isBlockedByOwner ? 'Kapattınız' : isReservedByPlayer ? 'Rezerve' : 'Müsait';
            const icon  = slot.isBlockedByOwner ? faLock : isReservedByPlayer ? faUserCheck : faCheckCircle;

            return (
              <button
                key={slot.id}
                onClick={() => !isReservedByPlayer && !isToggling && handleToggleBlock(slot)}
                disabled={isToggling || isReservedByPlayer}
                style={{
                  background: bg, borderRadius: 14, padding: '16px 20px',
                  border: 'none', borderLeft: `4px solid ${color}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: isReservedByPlayer ? 'default' : 'pointer',
                  textAlign: 'left', width: '100%',
                  opacity: isToggling ? 0.6 : 1, transition: 'opacity 0.15s',
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f1117' }}>
                    {slot.startTime} – {slot.endTime}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                    {isReservedByPlayer
                      ? 'Oyuncu rezervasyonu — değiştirilemez'
                      : slot.isBlockedByOwner
                      ? 'Müsaite almak için tıklayın'
                      : 'Kapatmak için tıklayın'}
                  </div>
                </div>
                {isToggling ? (
                  <div className="spinner" style={{ width: 18, height: 18, flexShrink: 0 }} />
                ) : (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                    background: '#fff', borderRadius: 999, padding: '5px 12px',
                    fontSize: 12, fontWeight: 700, color,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }}>
                    <FontAwesomeIcon icon={icon} />
                    {label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
