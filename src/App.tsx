import { useState, useCallback } from 'react';
import KakaoMap from './components/KakaoMap';
import BottomSheet from './components/BottomSheet';
import { DistrictInfo } from './data/seoulDistrictData';
import { GROUPS } from './data/districtGroups';
import './App.css';

export default function App() {
  const [selected, setSelected] = useState<DistrictInfo | null>(null);

  const handleDistrictClick = useCallback((district: DistrictInfo) => {
    setSelected(district);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>서울특별시 자치구 지도</h1>
        <p>구를 클릭하면 상세 정보를 확인할 수 있습니다</p>
      </header>

      <main className="app-main">
        {/* 그룹 범례 */}
        <div className="group-legend">
          {Object.values(GROUPS).map((g) => (
            <div key={g.id} className="gl-item">
              <span className="gl-dot" style={{ background: g.color }} />
              <span className="gl-name">{g.name}</span>
            </div>
          ))}
        </div>

        <KakaoMap onDistrictClick={handleDistrictClick} />

        <BottomSheet district={selected} onClose={handleClose} />
      </main>
    </div>
  );
}
