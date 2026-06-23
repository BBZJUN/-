import { useEffect, useRef, useState } from 'react';
import { useKakaoMapsSDK } from '../hooks/useKakaoMapsSDK';
import {
  useSeoulGeoJson,
  ringToLatLng,
  ringCentroid,
  SeoulFeature,
} from '../hooks/useSeoulGeoJson';
import { SEOUL_DISTRICTS, DistrictInfo } from '../data/seoulDistrictData';
import { getChoroColor, buildGradientCss } from '../utils/choropleth';

const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 };
const MAP_LEVEL = 10;

const valueMap = new Map(SEOUL_DISTRICTS.map((d) => [d.name, d.value]));
const allValues = SEOUL_DISTRICTS.map((d) => d.value);
const MIN_VAL = Math.min(...allValues);
const MAX_VAL = Math.max(...allValues);

// feature의 geometry에서 outer ring 목록 반환
function getOuterRings(feature: SeoulFeature): number[][][] {
  const { geometry } = feature;
  if (geometry.type === 'Polygon') {
    return [geometry.coordinates[0] as number[][]];
  }
  // MultiPolygon: 각 polygon의 outer ring
  return (geometry.coordinates as number[][][][]).map((poly) => poly[0]);
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<kakao.maps.Map | null>(null);
  const polygonsRef = useRef<kakao.maps.Polygon[]>([]);
  const overlaysRef = useRef<kakao.maps.CustomOverlay[]>([]);
  const hoverElRef = useRef<HTMLDivElement | null>(null);
  const hoverOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

  const { isLoaded, error: sdkError } = useKakaoMapsSDK();
  const { data: geoJson, loading: geoLoading, error: geoError } = useSeoulGeoJson();
  const [selected, setSelected] = useState<DistrictInfo | null>(null);

  useEffect(() => {
    if (!isLoaded || !geoJson || !mapRef.current) return;

    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
      level: MAP_LEVEL,
    });
    mapInstanceRef.current = map;

    // hover 툴팁
    const hoverEl = document.createElement('div');
    hoverEl.className = 'district-tooltip';
    hoverElRef.current = hoverEl;
    const hoverOverlay = new kakao.maps.CustomOverlay({
      content: hoverEl,
      position: new kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
      yAnchor: 2.2,
      zIndex: 200,
    });
    hoverOverlayRef.current = hoverOverlay;

    // 구별로 feature 묶기 → 구 라벨 중심 계산용
    const guCenterAccum = new Map<string, { latSum: number; lngSum: number; count: number }>();

    geoJson.features.forEach((feature) => {
      const guName = feature.properties.sggnm;       // 예: "종로구"
      const dongName = feature.properties.adm_nm;    // 예: "서울특별시 종로구 사직동"
      const value = valueMap.get(guName);
      if (value === undefined) return; // 서울 25개 구 이외 제외

      const color = getChoroColor(value, MIN_VAL, MAX_VAL);
      const outerRings = getOuterRings(feature);

      outerRings.forEach((ring) => {
        const path = ringToLatLng(ring);
        const polygon = new kakao.maps.Polygon({
          map,
          path,
          strokeWeight: 1,
          strokeColor: '#ffffff',
          strokeOpacity: 0.7,
          fillColor: color,
          fillOpacity: 0.75,
          zIndex: 1,
        });
        polygonsRef.current.push(polygon);

        const [cLat, cLng] = ringCentroid(ring);

        kakao.maps.event.addListener(polygon, 'mouseover', () => {
          polygon.setOptions({ fillOpacity: 0.95, strokeWeight: 2 });
          hoverEl.textContent = dongName;
          hoverOverlay.setPosition(new kakao.maps.LatLng(cLat, cLng));
          hoverOverlay.setMap(map);
        });
        kakao.maps.event.addListener(polygon, 'mouseout', () => {
          polygon.setOptions({ fillOpacity: 0.75, strokeWeight: 1 });
          hoverOverlay.setMap(null);
        });
        kakao.maps.event.addListener(polygon, 'click', () => {
          setSelected({ name: guName, value });
        });

        // 구 중심 누적
        const acc = guCenterAccum.get(guName) ?? { latSum: 0, lngSum: 0, count: 0 };
        acc.latSum += cLat;
        acc.lngSum += cLng;
        acc.count += 1;
        guCenterAccum.set(guName, acc);
      });
    });

    // 구마다 이름 + 값 라벨 1개
    guCenterAccum.forEach((acc, guName) => {
      const cLat = acc.latSum / acc.count;
      const cLng = acc.lngSum / acc.count;
      const value = valueMap.get(guName)!;

      const labelEl = document.createElement('div');
      labelEl.className = 'district-label';
      labelEl.innerHTML = `<span class="dl-name">${guName}</span><span class="dl-value">${value.toLocaleString()}</span>`;
      const overlay = new kakao.maps.CustomOverlay({
        content: labelEl,
        position: new kakao.maps.LatLng(cLat, cLng),
        yAnchor: 0.5,
        zIndex: 10,
      });
      overlay.setMap(map);
      overlaysRef.current.push(overlay);
    });

    return () => {
      polygonsRef.current.forEach((p) => p.setMap(null));
      overlaysRef.current.forEach((o) => o.setMap(null));
      polygonsRef.current = [];
      overlaysRef.current = [];
      hoverOverlay.setMap(null);
    };
  }, [isLoaded, geoJson]);

  const error = sdkError ?? geoError;
  const loading = !isLoaded || geoLoading;

  if (error) {
    return (
      <div className="map-status error">
        <p>⚠️ {error}</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="map-status loading">
        <div className="spinner" />
        <p>지도 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="kakao-map" />

      {selected && (
        <div className="info-panel">
          <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
          <div className="info-header">
            <span
              className="color-dot"
              style={{ background: getChoroColor(selected.value, MIN_VAL, MAX_VAL) }}
            />
            <h3>{selected.name}</h3>
          </div>
          <ul className="info-list">
            <li>
              <span className="label">값</span>
              <span className="value">{selected.value.toLocaleString()}</span>
            </li>
            <li>
              <span className="label">범위 내 위치</span>
              <span className="value">
                {(((selected.value - MIN_VAL) / (MAX_VAL - MIN_VAL)) * 100).toFixed(1)}%
              </span>
            </li>
          </ul>
        </div>
      )}

      <div className="legend">
        <h4>서울특별시 25개 자치구</h4>
        <div className="gradient-bar-wrap">
          <span className="grad-label">적음</span>
          <div className="gradient-bar" style={{ background: buildGradientCss() }} />
          <span className="grad-label">많음</span>
        </div>
        <div className="grad-minmax">
          <span>{MIN_VAL.toLocaleString()}</span>
          <span>{MAX_VAL.toLocaleString()}</span>
        </div>
        <div className="legend-grid">
          {SEOUL_DISTRICTS.map((d) => (
            <button
              key={d.name}
              className="legend-item"
              onClick={() => setSelected(d)}
            >
              <span
                className="legend-color"
                style={{ background: getChoroColor(d.value, MIN_VAL, MAX_VAL) }}
              />
              <span className="legend-name">{d.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
