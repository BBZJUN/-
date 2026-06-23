export interface Group {
  id: string;
  name: string;
  color: string;
}

// 그룹 이름·색상은 여기서 자유롭게 수정하세요.
export const GROUPS: Record<string, Group> = {
  A: { id: 'A', name: '강남권',      color: '#E05C5C' },
  B: { id: 'B', name: '동북권',      color: '#4A90D9' },
  C: { id: 'C', name: '서북권',      color: '#4CAF82' },
  D: { id: 'D', name: '도심·서남권', color: '#F0A43A' },
};
