export interface DistrictInfo {
  name: string;
  group: string;        // GROUPS 키값 (A/B/C/D)
  description: string;  // 팝업에 표시될 설명 — 자유롭게 수정하세요
}

export const SEOUL_DISTRICTS: DistrictInfo[] = [
  {
    name: '종로구', group: 'D',
    description: '조선 시대부터 이어진 역사의 중심지로, 경복궁·창덕궁 등 주요 문화재와 인사동·북촌 한옥마을이 위치해 있습니다.',
  },
  {
    name: '중구', group: 'D',
    description: '서울의 도심 핵심부로, 명동·남대문시장·을지로 등 상업·문화 명소가 집중된 지역입니다.',
  },
  {
    name: '용산구', group: 'D',
    description: '한강과 남산을 곁에 둔 용산구는 이태원·경리단길로 유명한 글로벌 문화 특구입니다.',
  },
  {
    name: '성동구', group: 'B',
    description: '성수동 카페거리와 뚝섬을 중심으로 힙한 문화가 발달한 서울의 신흥 트렌드 지역입니다.',
  },
  {
    name: '광진구', group: 'B',
    description: '건국대·어린이대공원을 품은 활기찬 지역으로, 젊은 세대가 많이 거주합니다.',
  },
  {
    name: '동대문구', group: 'B',
    description: '동대문디자인플라자(DDP)와 패션 상권이 어우러진 서울의 패션·디자인 메카입니다.',
  },
  {
    name: '중랑구', group: 'B',
    description: '중랑천을 따라 자연환경이 잘 보존된 주거 중심의 조용하고 안전한 지역입니다.',
  },
  {
    name: '성북구', group: 'B',
    description: '고려대·성신여대 등 대학교와 북한산 자락이 어우러진 교육·자연 환경이 뛰어난 지역입니다.',
  },
  {
    name: '강북구', group: 'B',
    description: '북한산 국립공원을 품고 있어 등산·자연 탐방을 즐기는 시민들이 많이 찾는 자연 친화적 지역입니다.',
  },
  {
    name: '도봉구', group: 'B',
    description: '도봉산·수락산으로 둘러싸인 맑은 공기와 쾌적한 환경의 주거 지역입니다.',
  },
  {
    name: '노원구', group: 'B',
    description: '대규모 아파트 단지와 학원가가 형성된 교육열 높은 가족 중심 주거 지역입니다.',
  },
  {
    name: '은평구', group: 'C',
    description: '북한산을 배경으로 은평뉴타운 등 현대적 주거지와 전통 한옥마을이 공존하는 지역입니다.',
  },
  {
    name: '서대문구', group: 'C',
    description: '연세대·이화여대 등 명문대가 모여 있는 대학가로, 역사적 서대문형무소역사관이 있습니다.',
  },
  {
    name: '마포구', group: 'C',
    description: '홍대·합정·상암 등 청년 문화와 미디어 산업의 중심지로 서울에서 가장 활기찬 지역 중 하나입니다.',
  },
  {
    name: '양천구', group: 'C',
    description: '목동 학원가로 유명하며, 교육 인프라가 잘 갖춰진 서울의 대표적인 교육 특구입니다.',
  },
  {
    name: '강서구', group: 'C',
    description: '김포공항과 인접한 서울 서쪽의 관문으로, 마곡 지구 등 첨단 산업단지가 빠르게 성장하고 있습니다.',
  },
  {
    name: '구로구', group: 'D',
    description: '구로디지털단지를 중심으로 IT·벤처 기업이 집적된 서울의 대표적인 산업·업무 지구입니다.',
  },
  {
    name: '금천구', group: 'D',
    description: '가산디지털단지로 이어지는 IT 특화 지역으로, 소규모 기업과 스타트업이 활발한 지역입니다.',
  },
  {
    name: '영등포구', group: 'D',
    description: '여의도 금융 특구와 타임스퀘어 등 대형 쇼핑·금융의 중심지입니다.',
  },
  {
    name: '동작구', group: 'D',
    description: '노량진 고시촌과 국립현충원이 위치한 지역으로, 교육열과 역사적 의미가 함께하는 곳입니다.',
  },
  {
    name: '관악구', group: 'D',
    description: '서울대학교가 자리한 대표적인 대학가로, 관악산 등산로와 함께 청년 문화가 풍부한 지역입니다.',
  },
  {
    name: '서초구', group: 'A',
    description: '대법원·검찰청 등 법조 타운과 예술의 전당이 위치한 문화·사법의 중심지입니다.',
  },
  {
    name: '강남구', group: 'A',
    description: '강남대로와 테헤란로를 중심으로 대기업 본사와 고급 상업시설이 밀집한 서울의 경제 중심지입니다.',
  },
  {
    name: '송파구', group: 'A',
    description: '롯데월드·올림픽공원·석촌호수 등 여가시설이 풍부한 서울 동남부의 대표 주거·문화 지역입니다.',
  },
  {
    name: '강동구', group: 'A',
    description: '암사 선사주거지 등 역사 유적지와 함께 하남 도시개발로 발전 중인 서울 동쪽 끝의 신흥 성장 지역입니다.',
  },
];
