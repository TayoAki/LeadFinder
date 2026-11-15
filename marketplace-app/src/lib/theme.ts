// Colour system (colour theory, contrast-checked to WCAG AA):
// - ORANGE is the Shelby brand and the buy colour. Orange reads as energy, warmth and value (the
//   family of Amazon, Fanta, JBL), and it is the colour shoppers already associate with "buy".
//   It is used ONLY for the logo and buying actions (Add to cart, Checkout, Pay, Shop now), so the
//   isolation effect still makes the button the one thing the eye finds. Ink on orange is 6.1:1.
// - NAVY ink is orange's complement (blue-orange): text, headers, navigation and primary buttons.
//   Complementary contrast is what makes the orange pop; white on navy is 15.9:1.
// - Burnt orange is the quiet text highlight (links, selection, progress): 5.2:1 on the background,
//   where bright orange text would fail (2.6:1).
// - Red only means a real saving or a problem (sale prices, low stock, errors, count badges).
// - Green only means trust: in stock, free shipping, returns, guarantees, success.
// - Warm off-white background keeps product photos the most saturated thing on screen.
export const C = {
  bg: '#FFF8F1',
  surface: '#FFFFFF',
  ink: '#16213E', // navy: orange's complement
  ink2: '#4B5270',
  ink3: '#666C86',
  line: '#F1E4D6',
  photo: '#F7EEE5', // product photo backdrop
  accent: '#B04A00', // burnt orange: links, selection, progress, icons
  accentSoft: '#FFEEDF',
  buy: '#FF7A1A', // brand orange, buying actions only
  buyPressed: '#F26A05',
  buyInk: '#16213E',
  buySoft: '#FFF0E2',
  sale: '#C8102E', // real discounts, low stock, errors, badges
  saleSoft: '#FDE8EA',
  good: '#157A4A',
  goodSoft: '#E7F4EC',
  warn: '#8A5A00',
  warnSoft: '#FFF3D1',
  spark: '#FF7A1A', // logo and mascot accents
  dark: '#16213E',
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
