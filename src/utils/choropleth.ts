type RGB = [number, number, number];

const COLOR_STOPS: { t: number; rgb: RGB }[] = [
  { t: 0.0,  rgb: [100, 149, 237] }, // 파랑 (낮음)
  { t: 0.25, rgb: [173, 216, 230] }, // 연파랑
  { t: 0.5,  rgb: [250, 250, 210] }, // 연노랑
  { t: 0.75, rgb: [250, 165, 140] }, // 연빨강
  { t: 1.0,  rgb: [205,  80,  80] }, // 빨강 (높음)
];

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

export function getChoroColor(value: number, min: number, max: number): string {
  if (max === min) return `rgb(200,200,200)`;
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));

  let lo = COLOR_STOPS[0];
  let hi = COLOR_STOPS[COLOR_STOPS.length - 1];
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (t >= COLOR_STOPS[i].t && t <= COLOR_STOPS[i + 1].t) {
      lo = COLOR_STOPS[i];
      hi = COLOR_STOPS[i + 1];
      break;
    }
  }

  const segT = (t - lo.t) / (hi.t - lo.t);
  const r = lerp(lo.rgb[0], hi.rgb[0], segT);
  const g = lerp(lo.rgb[1], hi.rgb[1], segT);
  const b = lerp(lo.rgb[2], hi.rgb[2], segT);
  return `rgb(${r},${g},${b})`;
}

export function buildGradientCss(): string {
  const stops = COLOR_STOPS.map(
    ({ t, rgb }) => `rgb(${rgb.join(',')}) ${t * 100}%`
  ).join(', ');
  return `linear-gradient(to right, ${stops})`;
}
