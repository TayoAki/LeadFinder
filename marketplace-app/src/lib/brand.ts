// Single source for the app's name and promise. Change it here and the logo, headers,
// share cards and invite copy all follow. "Shelby" / "hireshelby" is not trademark-checked yet.
export const BRAND = {
  name: 'Shelby',
  storeName: 'Shelby: AI Shopper for Small Shops',
  tagline: 'Shop small sellers, one cart',
  promise: 'Tell Shelby what you need. She finds it from independent shops.',
  domain: 'hireshelby.com',
  referralReward: 10, // dollars to both the inviter and the friend
  firstOrderOff: 10,
};

export const link = (path: string, ref?: string) => `https://${BRAND.domain}${path}${ref ? `?ref=${ref}` : ''}`;
