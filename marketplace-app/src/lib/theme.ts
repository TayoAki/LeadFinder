// Colour system: "Sunset & Sage" (contrast-checked to WCAG AA).
// - TERRACOTTA (#E66739) is the brand: logo, icons, badges. Buying actions use a deeper terracotta
//   (#BF4F26) so white button text passes AA (4.8:1; white on #E66739 is only 3.3:1). Warm orange-red
//   reads as energy and appetite, and it is used for buying only, so the button is what the eye finds.
// - DEEP INDIGO (#1E2E4B) is terracotta's complement (blue vs orange): text, headers, primary buttons.
//   Indigo on cream is 12.7:1.
// - SAGE (#8AA382) is the calm counterweight (green opposite red on the wheel): secondary actions
//   (indigo text on sage, 4.9:1) and trust cues (deep sage text #4D6B46, 5.6:1).
// - SOFT BLUSH (#F6E3E0) for highlighted panels; WARM CREAM (#FAF7F2) background keeps photos the most
//   saturated thing on screen.
// - Red only means a real saving or a problem (sale prices, low stock, errors, count badges).
export const C = {
  bg: '#FAF7F2', // warm cream
  surface: '#FFFFFF',
  ink: '#1E2E4B', // deep indigo
  ink2: '#4A5670',
  ink3: '#646D85',
  line: '#EDE6DC',
  photo: '#F3EEE7', // product photo backdrop
  accent: '#B34A22', // terracotta text: links, selection, progress, icons (5.0:1 on cream)
  accentSoft: '#F6E3E0', // soft blush
  buy: '#BF4F26', // deep terracotta: buying actions only
  buyPressed: '#A8431F',
  buyInk: '#FFFFFF',
  buySoft: '#FBE9E2',
  brand: '#E66739', // terracotta: logo, icons, badges (not text)
  sage: '#8AA382', // secondary actions, with indigo text
  sale: '#C8102E', // real discounts, low stock, errors, badges
  saleSoft: '#FDE8EA',
  good: '#4D6B46', // deep sage: in stock, returns, guarantees, success
  goodSoft: '#E8EFE5',
  warn: '#8A5A00',
  warnSoft: '#FFF3D1',
  spark: '#E66739', // logo and mascot accents
  dark: '#1E2E4B',
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
