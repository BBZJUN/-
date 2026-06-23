import { useEffect, useRef } from 'react';
import { useKakaoMapsSDK } from '../hooks/useKakaoMapsSDK';
import { useSeoulGeoJson, ringToLatLng, ringCentroid, SeoulFeature } from '../hooks/useSeoulGeoJson';
import { SEOUL_DISTRICTS, DistrictInfo } from '../data/seoulDistrictData';
import { GROUPS } from '../data/districtGroups';

const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 };
const MAP_LEVEL = 10;

// 구 이름 → 구 데이터 맵
const districtMap = new Map(SEOUL_DISTRICTS.map((d) => [d.name, d]));

function getOuterRings(feature: SeoulFeature): number[][][] {
  const { geometry } = feature;
  if (geometry.type === 'Polygon') {
    return [(geometry.coordinates as number[][][])[0]];
  }
  return (geometry.coordinates as number[][][][]).map((poly) => poly[0]);
}

interface Props {
  onDistrictClick: (district: DistrictInfo) => void;
}

export default function KakaoMap({ onDistrictClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const polygonsRef = useRef<kakao.maps.Polygon[]>([]);
  const overlaysRef = useRef<kakao.maps.CustomOverlay[]>([]);
  const hoverOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

  const { isLoaded, error: sdkError } = useKakaoMapsSDK();
  const { data: geoJson, loading: geoLoading, error: geoError } = useSeoulGeoJson();

  useEffect(() => {
    if (!isLoaded || !geoJson || !mapRef.current) return;

    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
      level: MAP_LEVEL,
    });

    // hover 툴팁
    const hoverEl = document.createElement('div');
    hoverEl.className = 'district-tooltip';
    const hoverOverlay = new kakao.maps.CustomOverlay({
      content: hoverEl,
      position: new kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
      yAnchor: 2.2,
      zIndex: 200,
    });
    hoverOverlayRef.current = hoverOverlay;

    // 구별 라벨 중심 누적
    const guAccum = new Map<string, { latSum: number; lngSum: number; count: number }>();

    geoJson.features.forEach((feature) => {
      const guName = feature.properties.sggnm;
      const districtInfo = districtMap.get(guName);
      if (!districtInfo) return;

      const group = GROUPS[districtInfo.group];
      const outerRings = getOuterRings(feature);

      outerRings.forEach((ring) => {
        const path = ringToLatLng(ring);
        const polygon = new kakao.maps.Polygon({
          map,
          path,
          strokeWeight: 1,
          strokeColor: '#ffffff',
          strokeOpacity: 0.6,
          fillColor: group.color,
          fillOpacity: 0.65,
          zIndex: 1,
        });
        polygonsRef.current.push(polygon);

        const [cLat, cLng] = ringCentroid(ring);

        kakao.maps.event.addListener(polygon, 'mouseover', () => {
          polygon.setOptions({ fillOpacity: 0.88, strokeWeight: 2 });
          hoverEl.textContent = guName;
          hoverOverlay.setPosition(new kakao.maps.LatLng(cLat, cLng));
          hoverOverlay.setMap(map);
        });
        kakao.maps.event.addListener(polygon, 'mouseout', () => {
          polygon.setOptions({ fillOpacity: 0.65, strokeWeight: 1 });
          hoverOverlay.setMap(null);
        });
        kakao.maps.event.addListener(polygon, 'click', () => {
          onDistrictClick(districtInfo);
        });

        const acc = guAccum.get(guName) ?? { latSum: 0, lngSum: 0, count: 0 };
        acc.latSum += cLat; acc.lngSum += cLng; acc.count += 1;
        guAccum.set(guName, acc);
      });
    });

    // 구 이름 라벨 (구당 1개)
    guAccum.forEach((acc, guName) => {
      const labelEl = document.createElement('div');
      labelEl.className = 'district-label';
      labelEl.innerHTML = `<span class="dl-name">${guName}</span>`;
      const overlay = new kakao.maps.CustomOverlay({
        content: labelEl,
        position: new kakao.maps.LatLng(acc.latSum / acc.count, acc.lngSum / acc.count),
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
  }, [isLoaded, geoJson, onDistrictClick]);

  const error = sdkError ?? geoError;
  const loading = !isLoaded || geoLoading;

  if (error) return <div className="map-status error"><p>⚠️ {error}</p></div>;
  if (loading) return (
    <div className="map-status loading">
      <div className="spinner" />
      <p>지도 데이터를 불러오는 중...</p>
    </div>
  );

  return <div ref={mapRef} className="kakao-map" />;
}
