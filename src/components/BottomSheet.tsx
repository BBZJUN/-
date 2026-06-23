import { useEffect, useState } from 'react';
import { DistrictInfo } from '../data/seoulDistrictData';
import { GROUPS } from '../data/districtGroups';

interface Props {
  district: DistrictInfo | null;
  onClose: () => void;
}

export default function BottomSheet({ district, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<DistrictInfo | null>(null);

  useEffect(() => {
    if (district) {
      setCurrent(district);
      // 다음 프레임에 show 클래스 추가 → 슬라이드 애니메이션 트리거
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      // 슬라이드 아웃 완료 후 컨텐츠 제거
      const t = setTimeout(() => setCurrent(null), 360);
      return () => clearTimeout(t);
    }
  }, [district]);

  if (!current) return null;

  const group = GROUPS[current.group];

  return (
    <>
      {/* 반투명 배경 — 클릭하면 닫힘 */}
      <div
        className={`bs-backdrop ${visible ? 'show' : ''}`}
        onClick={onClose}
      />

      <div className={`bottom-sheet ${visible ? 'show' : ''}`}>
        {/* 드래그 핸들 바 */}
        <div className="bs-handle" onClick={onClose} />

        <div className="bs-body">
          {/* 헤더: 그룹 배지 + 구 이름 + 닫기 버튼 */}
          <div className="bs-header">
            <div className="bs-title-area">
              <span
                className="bs-badge"
                style={{ background: group.color }}
              >
                {group.name}
              </span>
              <h2 className="bs-title">{current.name}</h2>
            </div>
            <button className="bs-close" onClick={onClose} aria-label="닫기">
              ✕
            </button>
          </div>

          {/* 설명 텍스트 */}
          <p className="bs-desc">{current.description}</p>
        </div>
      </div>
    </>
  );
}
