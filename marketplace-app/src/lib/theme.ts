// Colour system: warm analogous palette, orange + yellow (contrast-checked to WCAG AA).
// - Orange and yellow sit next to each other on the colour wheel (analogous harmony), so nothing
//   clashes; the earlier indigo was orange's complement and fought with it on a warm background.
//   It is the palette shoppers already read as "buy" (Amazon: yellow Add to Cart, orange Buy Now).
// - YELLOW (#FFD814) is the main buying action (Add to cart, Add the set, Checkout, Pay), with
//   charcoal text (11.8:1) and a darker-yellow edge, because yellow on cream is only 1.3:1.
// - TERRACOTTA ORANGE is the brand (#E66739 logo, icons) and the strong secondary action
//   (Buy now, primary buttons: #BF4F26 with white text, 4.8:1); #B34A22 for orange text and links (5.0:1).
// - WARM CHARCOAL (#231F1A) replaces blue for text and dark surfaces (15.3:1 on cream): a neutral
//   that belongs to the warm family instead of competing with it.
// - Green only means trust (in stock, returns, guarantees); red only means a saving or a problem.
export const C = {
  bg: '#FAF7F2', // warm cream
  surface: '#FFFFFF',
  ink: '#231F1A', // warm charcoal
  ink2: '#5A5148',
  ink3: '#716759',
  line: '#EDE6DC',
  photo: '#F3EEE7', // product photo backdrop
  accent: '#B34A22', // orange text: links, selection, progress, icons
  accentSoft: '#FDE9DC', // soft orange panels
  buy: '#FFD814', // yellow: main buying actions
  buyPressed: '#F7CA00',
  buyInk: '#231F1A',
  buyEdge: '#E3B800', // button edge so yellow reads on cream
  buySoft: '#FFF3C4',
  brand: '#E66739', // terracotta: logo, icons, badges (not text)
  primary: '#BF4F26', // deep terracotta: Buy now, primary buttons (white text)
  sage: '#FDE1D3', // secondary actions (soft orange), charcoal text
  sale: '#C8102E', // real discounts, low stock, errors, badges
  saleSoft: '#FDE8EA',
  good: '#4D6B46', // trust: in stock, returns, guarantees, success
  goodSoft: '#E8EFE5',
  warn: '#8A5A00',
  warnSoft: '#FFF3D1',
  spark: '#E66739', // logo and mascot accents
  dark: '#231F1A',
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
