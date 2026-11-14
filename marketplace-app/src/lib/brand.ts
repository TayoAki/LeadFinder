// Single source for the app's name and promise. Change it here and the logo, headers,
// share cards and invite copy all follow. Working name from idea-engine/marketplace/viral-research.md
// (not a trademark search).
export const BRAND = {
  name: 'Stalls',
  storeName: 'Stalls: Indie Shops',
  tagline: 'Shop small sellers, one cart',
  domain: 'stalls.app',
  referralReward: 10, // dollars to both the inviter and the friend
  firstOrderOff: 10,
};

export const link = (path: string, ref?: string) => `https://${BRAND.domain}${path}${ref ? `?ref=${ref}` : ''}`;
