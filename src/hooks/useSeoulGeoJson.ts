import { useState, useEffect } from 'react';

// 행정안전부 공개 GeoJSON (서울 자치구 경계, WGS84)
// southkorea/seoul-maps 오픈소스 데이터 (jsDelivr CDN)
const GEOJSON_URL =
  'https://cdn.jsdelivr.net/gh/southkorea/seoul-maps@master/kostat/2013/json/seoul_municipalities_geo_simple.json';

export interface GeoFeature {
  type: 'Feature';
  properties: Record<string, string>;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface SeoulGeoJson {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

export function useSeoulGeoJson() {
  const [data, setData] = useState<SeoulGeoJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<SeoulGeoJson>;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(`GeoJSON 로드 실패: ${err.message}`);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

// GeoJSON 좌표([lng, lat])를 Kakao LatLng 배열로 변환
export function ringToLatLng(ring: number[][]): kakao.maps.LatLng[] {
  return ring.map(([lng, lat]) => new kakao.maps.LatLng(lat, lng));
}
