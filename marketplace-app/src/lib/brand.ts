// Single source for the app's name and promise. Change it here and the logo, headers,
// share cards and invite copy all follow. "Shelby" / "hireshelby" is not trademark-checked yet.
export const BRAND = {
  name: 'Shelby',
  storeName: 'Shelby',
  tagline: 'Everyday favourites, picked for you',
  promise: 'Fashion, beauty, supplements and home in one store. Take the quiz and Shelby picks for you.',
  domain: 'hireshelby.com',
  referralReward: 10, // dollars to both the inviter and the friend
  firstOrderOff: 10,
};

export const link = (path: string, ref?: string) => `https://${BRAND.domain}${path}${ref ? `?ref=${ref}` : ''}`;
