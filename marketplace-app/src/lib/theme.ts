// Colour system (colour theory, contrast-checked to WCAG AA):
// - Plum (from the logo) carries the brand: text, headers, navigation.
// - BUY is plum's complement, a warm saffron. It is reserved for actions that move money
//   (Add to cart, Checkout, Pay, Shop): complementary contrast plus the isolation effect make the
//   one thing that differs the thing the eye finds. Ink on saffron is 10.5:1 (the old white-on-
//   coral button was 3.25:1 and failed AA).
// - Plum-magenta (analogous to plum) is the quiet highlight: links, selection, progress, icons.
// - Red only means a real saving or a problem (sale prices, low stock, errors, count badges).
// - Green only means trust: in stock, free shipping, returns, guarantees, success.
// - Warm cream background keeps product photos the most saturated thing on screen.
export const C = {
  bg: '#FBF8F3',
  surface: '#FFFFFF',
  ink: '#2B0627', // plum from the Shelby logo
  ink2: '#5E4B5B',
  ink3: '#7A6A77',
  line: '#ECE4D9',
  photo: '#F1ECE4', // product photo backdrop
  accent: '#8B2A7A', // highlight: links, selection, progress, icons
  accentSoft: '#F5E8F2',
  buy: '#FFB81C', // complementary CTA, buying actions only
  buyPressed: '#F2A400',
  buyInk: '#2B0627',
  buySoft: '#FFF3D1',
  sale: '#C8102E', // real discounts, low stock, errors, badges
  saleSoft: '#FDE8EA',
  good: '#157A4A',
  goodSoft: '#E7F4EC',
  warn: '#8A5A00',
  warnSoft: '#FFF3D1',
  spark: '#FD5243', // the logo's sparkle: mascot only
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
