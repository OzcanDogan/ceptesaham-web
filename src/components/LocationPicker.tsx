import React, { useEffect, useState } from 'react';
import { getCities, getDistricts, getNeighborhoods, City, District, Neighborhood } from '../api/location';

export interface LocationValue {
  cityId?: number;
  districtId?: number;
  neighborhoodId?: number;
}

interface Props {
  value?: LocationValue;
  onChange: (v: LocationValue) => void;
  initialCityName?: string;
  initialDistrictName?: string;
  initialNeighborhoodName?: string;
}

const sel: React.CSSProperties = {
  width: '100%', padding: '11px 14px', fontSize: 14,
  background: '#f9fafb', border: '1.5px solid #e5e7eb',
  borderRadius: 10, outline: 'none', color: '#111',
  boxSizing: 'border-box', fontFamily: 'inherit', cursor: 'pointer',
};

export default function LocationPicker({ value, onChange, initialCityName, initialDistrictName, initialNeighborhoodName }: Props) {
  const [cities, setCities]             = useState<City[]>([]);
  const [districts, setDistricts]       = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingDistricts, setLoadingDistricts]       = useState(false);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(false);

  useEffect(() => {
    getCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    if (value?.cityId) {
      setLoadingDistricts(true);
      getDistricts(value.cityId)
        .then(setDistricts)
        .catch(() => {})
        .finally(() => setLoadingDistricts(false));
    } else {
      setDistricts([]);
      setNeighborhoods([]);
    }
  }, [value?.cityId]);

  useEffect(() => {
    if (value?.districtId) {
      setLoadingNeighborhoods(true);
      getNeighborhoods(value.districtId)
        .then(setNeighborhoods)
        .catch(() => {})
        .finally(() => setLoadingNeighborhoods(false));
    } else {
      setNeighborhoods([]);
    }
  }, [value?.districtId]);

  const onFocus = (e: React.FocusEvent<HTMLSelectElement>) => e.target.style.borderColor = '#22c55e';
  const onBlur  = (e: React.FocusEvent<HTMLSelectElement>) => e.target.style.borderColor = '#e5e7eb';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* City */}
      <select
        style={sel}
        value={value?.cityId || ''}
        onChange={e => {
          const id = Number(e.target.value) || undefined;
          onChange({ cityId: id, districtId: undefined, neighborhoodId: undefined });
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <option value="">İl seçin...</option>
        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      {/* District */}
      <select
        style={{ ...sel, opacity: !value?.cityId ? 0.5 : 1 }}
        value={value?.districtId || ''}
        disabled={!value?.cityId}
        onChange={e => {
          const id = Number(e.target.value) || undefined;
          onChange({ cityId: value?.cityId, districtId: id, neighborhoodId: undefined });
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <option value="">{loadingDistricts ? 'Yükleniyor...' : 'İlçe seçin...'}</option>
        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      {/* Neighborhood */}
      <select
        style={{ ...sel, opacity: !value?.districtId ? 0.5 : 1 }}
        value={value?.neighborhoodId || ''}
        disabled={!value?.districtId}
        onChange={e => {
          const id = Number(e.target.value) || undefined;
          onChange({ cityId: value?.cityId, districtId: value?.districtId, neighborhoodId: id });
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <option value="">{loadingNeighborhoods ? 'Yükleniyor...' : 'Mahalle seçin...'}</option>
        {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
      </select>
    </div>
  );
}
