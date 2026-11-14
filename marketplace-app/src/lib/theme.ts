// Design tokens. One accent colour does the selling; everything else stays quiet.
export const C = {
  bg: '#FAF7F2',
  surface: '#FFFFFF',
  ink: '#2B0627', // plum from the Shelby logo
  ink2: '#5F5260',
  ink3: '#8E8290',
  line: '#ECE5DB',
  accent: '#FD5243', // coral from the logo's sparkle: buy, drops, live
  accentSoft: '#FFE7E3',
  good: '#1E8E5A',
  goodSoft: '#E3F4EB',
  warn: '#B7791F',
  warnSoft: '#FDF1DC',
  dark: '#2B0627',
};

export const R = { sm: 8, md: 14, lg: 20, pill: 999 };
export const S = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const T = {
  h1: { fontSize: 28, fontWeight: '800' as const, color: C.ink, letterSpacing: -0.5 },
  h2: { fontSize: 20, fontWeight: '800' as const, color: C.ink, letterSpacing: -0.3 },
  h3: { fontSize: 16, fontWeight: '700' as const, color: C.ink },
  body: { fontSize: 15, color: C.ink, lineHeight: 21 },
  small: { fontSize: 13, color: C.ink2 },
  tiny: { fontSize: 11, color: C.ink3, fontWeight: '600' as const },
};
