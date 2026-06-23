// value 값만 여기서 관리하면 됩니다.
// 폴리곤 경계는 GeoJSON에서 자동으로 가져옵니다.
export interface DistrictInfo {
  name: string;
  value: number;
}

// 원하는 데이터(인구, 가격, 면적 등)로 value를 자유롭게 교체하세요.
export const SEOUL_DISTRICTS: DistrictInfo[] = [
  { name: '종로구', value: 10698 },
  { name: '중구',   value: 8823  },
  { name: '용산구', value: 19468 },
  { name: '성동구', value: 18990 },
  { name: '광진구', value: 22415 },
  { name: '동대문구', value: 21151 },
  { name: '중랑구', value: 26212 },
  { name: '성북구', value: 27041 },
  { name: '강북구', value: 21047 },
  { name: '도봉구', value: 22423 },
  { name: '노원구', value: 30567 },
  { name: '은평구', value: 31725 },
  { name: '서대문구', value: 19937 },
  { name: '마포구', value: 25604 },
  { name: '양천구', value: 26850 },
  { name: '강서구', value: 37800 },
  { name: '구로구', value: 21967 },
  { name: '금천구', value: 14624 },
  { name: '영등포구', value: 21351 },
  { name: '동작구', value: 21093 },
  { name: '관악구', value: 29094 },
  { name: '서초구', value: 26762 },
  { name: '강남구', value: 39792 },
  { name: '송파구', value: 38005 },
  { name: '강동구', value: 28646 },
];
