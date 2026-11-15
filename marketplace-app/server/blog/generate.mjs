// Catalogue posts: one buying guide (listicle) and one story (advertorial) per Printify product,
// written for the shopper, by the store that sells it.
//
// Voice (brand-voice / direct-response-copy / seo-content skills):
//   - we are the store talking to one shopper ("you"), in the shopper's words, not the supplier's.
//     No supplier jargon (blanks, print providers, decoration methods, "your design", rebranding).
//   - products are called by plain names ("the heavy cotton tee"), never by brand + model number.
//   - every feature is turned into what it means for the person wearing or using it (the "so what").
//   - every post says honestly who should skip the product. No promise the store can't back:
//     no returns, exchanges, refunds or guarantees.
//   - answer first (first 40 words), sentence-case headings, questions as headings, FAQ, no em dashes.
//
// Facts come only from the product's own catalogue data (description, features, care, size guide,
// variants, production times). A section with no data is left out rather than padded.
const COUNTRY = { US: 'the US', GB: 'the UK', CA: 'Canada', AU: 'Australia', DE: 'Germany', LV: 'Latvia', CZ: 'Czechia', CN: 'China', LT: 'Lithuania', PL: 'Poland', FR: 'France', ES: 'Spain', NL: 'the Netherlands', MX: 'Mexico', IT: 'Italy', SE: 'Sweden', JP: 'Japan', BE: 'Belgium', DK: 'Denmark', NZ: 'New Zealand' };

// Catalogue categories (blog hubs), matched on the product title; first match wins.
export const CATEGORIES = [
  ['Kids and baby', /\b(kid|kids|youth|toddler|baby|infant|onesie|bodysuit|bib)\b/],
  ['Pet products', /\b(pet|dog|cat|bandana collar|leash)\b/],
  ['Hoodies and sweatshirts', /hoodie|sweatshirt|crewneck|zip[- ]up|pullover/],
  ['Long sleeve tops', /long sleeve|longsleeve|raglan/],
  ['Tank tops', /tank|camisole|muscle/],
  ['T-shirts', /t-shirt|\btee\b|tshirt|jersey/],
  ['Polos and shirts', /polo|button|shirt|blouse/],
  ['Bottoms', /pant|jogger|short|legging|skirt|sweatpant|trouser/],
  ['Dresses', /dress/],
  ['Swimwear', /swim|bikini/],
  ['Outerwear', /jacket|windbreaker|vest|coat|fleece/],
  ['Hats', /\bhat\b|\bcap\b|beanie|bucket|visor|snapback|trucker/],
  ['Footwear', /shoe|sneaker|slipper|slide|flip|sock/],
  ['Bags', /bag|tote|backpack|fanny|pouch|duffel|wallet/],
  ['Phone and tech', /phone|case|airpod|laptop|mouse pad|mousepad|tablet|charger|popsocket|skin/],
  ['Mugs and drinkware', /mug|tumbler|bottle|glass|cup|can cooler|koozie|flask/],
  ['Kitchen and dining', /apron|plate|bowl|coaster|cutting board|placemat|napkin|oven|kitchen|lunch/],
  ['Wall art', /poster|canvas|print|frame|tapestry|wall|metal art|acrylic/],
  ['Home textiles', /pillow|cushion|blanket|throw|towel|rug|mat|curtain|duvet|sheet|shower/],
  ['Home decor', /candle|clock|ornament|vase|sign|magnet|puzzle|decor/],
  ['Stationery and stickers', /sticker|notebook|journal|card|calendar|planner|paper|postcard|bookmark/],
  ['Jewelry and accessories', /necklace|bracelet|earring|ring|keychain|pin|scarf|mask|glasses|watch|tie/],
  ['Sports and outdoors', /yoga|golf|ball|sport|jersey|bike|camping|beach/],
];
export const categoryOf = (title) => { const t = title.toLowerCase(); return (CATEGORIES.find(([, re]) => re.test(t)) || ['Other products'])[0]; };
const WEARABLE = new Set(['Kids and baby', 'Hoodies and sweatshirts', 'Long sleeve tops', 'Tank tops', 'T-shirts', 'Polos and shirts', 'Bottoms', 'Dresses', 'Swimwear', 'Outerwear', 'Footwear']);

// Who reads each category, what they already believe, and what they are trying to avoid.
// `pain` opens the story in their words; `want` is the outcome they are buying; `gift` marks
// categories people often buy for someone else.
export const ICP = {
  'T-shirts': { reader: 'someone tired of tees that give up after a few washes', pain: 'Most of us own a drawer of tees that shrank a size, went thin, or lost their collar after a few washes.', want: 'a tee that still looks like itself after months of wear' },
  'Hoodies and sweatshirts': { reader: 'someone after the one sweatshirt they reach for every cold morning', pain: 'Everyone has a favourite sweatshirt, right up until the cuffs stretch out and the inside starts to pill.', want: 'a sweatshirt that stays soft and keeps its shape' },
  'Long sleeve tops': { reader: 'someone who lives in long sleeves between seasons', pain: 'Long sleeves are the layer you wear most in spring and autumn, so a cheap one shows it fast at the cuffs and collar.', want: 'a long sleeve top that layers well and lasts' },
  'Tank tops': { reader: 'someone who wants to stay cool when it is hot', pain: 'A tank top has one job: keep you cool without clinging or stretching out at the arms.', want: 'a tank that stays cool and keeps its shape' },
  'Polos and shirts': { reader: 'someone who needs to look put together all day', pain: 'A shirt with a collar has to look as sharp at 5pm as it did at 9am.', want: 'a shirt that looks smart without fuss' },
  'Bottoms': { reader: 'someone who wears their joggers and shorts hard', pain: 'Joggers and shorts get worn hard. The waistband usually goes first.', want: 'bottoms that stay comfortable and keep their fit' },
  'Dresses': { reader: 'someone who wants an easy dress that looks put together', pain: 'The best dress is the one you can throw on and feel put together in, without ironing or second-guessing the fit.', want: 'an easy dress that fits and feels good' },
  'Swimwear': { reader: 'someone heading to the pool or the beach', pain: 'Swimwear has to cope with chlorine, salt and sun, and still fit when it is wet.', want: 'swimwear that fits well wet or dry' },
  'Outerwear': { reader: 'someone who wants the jacket they grab every day', pain: 'A jacket earns its place when it is the one you grab on the way out every single day.', want: 'a jacket that is easy to live in' },
  'Hats': { reader: 'someone who wants a hat that fits and keeps its shape', pain: 'A hat should fit without a fight and still look right after a day squashed in a bag.', want: 'a hat that fits and holds its shape' },
  'Footwear': { reader: 'someone who judges shoes and socks by the end of the day', pain: 'Shoes and socks get judged at the end of a long day: are your feet comfortable or not?', want: 'comfortable footwear that lasts' },
  'Bags': { reader: 'someone who carries a lot', pain: 'A bag gets loaded up, dropped and dragged around. Straps and seams are what fail first.', want: 'a bag that carries everything and holds up' },
  'Phone and tech': { reader: 'someone protecting gear they rely on every day', pain: 'A case or sleeve should protect the thing you carry everywhere without making it bulky.', want: 'protection that fits and does not get in the way' },
  'Mugs and drinkware': { reader: 'someone choosing the mug or bottle they will use every day, or a gift', pain: 'A mug is the thing you hold every morning. It should feel right in your hand and cope with daily washing.', want: 'a mug or bottle that is easy to use and easy to clean', gift: true },
  'Kitchen and dining': { reader: 'someone who cooks and eats at home a lot', pain: 'Kitchen things get splashed, washed and used every day, so they need to be easy to clean.', want: 'kitchen pieces that are practical and easy to care for', gift: true },
  'Wall art': { reader: 'someone making a room feel finished', pain: 'Bare walls make a room feel unfinished, but framing art is a hassle and good prints can cost a lot.', want: 'art that makes a room feel like yours', gift: true },
  'Home textiles': { reader: 'someone making home feel lived in', pain: 'Pillows, blankets and towels are what make a room feel lived in, and they get washed a lot.', want: 'soft things for the home that wash well', gift: true },
  'Home decor': { reader: 'someone adding small touches to their space', pain: 'Small pieces are how a place starts to feel like yours.', want: 'a decor piece with personality', gift: true },
  'Stationery and stickers': { reader: 'someone who notices cheap paper and peeling stickers', pain: 'Notebooks and stickers are small, but you notice cheap paper and peeling stickers straight away.', want: 'stationery that feels good to use', gift: true },
  'Jewelry and accessories': { reader: 'someone who wears accessories every day', pain: 'Accessories get worn every day and seen up close, so they need to hold up.', want: 'an accessory that looks good and lasts', gift: true },
  'Kids and baby': { reader: 'a parent or someone buying a gift for a child', pain: 'Kids clothes get washed constantly and outgrown fast, so softness and easy care matter more than anything.', want: 'something soft, easy to wash and easy to put on', gift: true },
  'Pet products': { reader: 'a pet owner', pain: 'Pet gear gets chewed, muddy and washed over and over.', want: 'pet gear that is tough and easy to clean' },
  'Sports and outdoors': { reader: 'someone who trains or spends time outdoors', pain: 'Gear for sport and the outdoors has to cope with sweat, sun and being thrown in a bag.', want: 'gear that keeps up with you' },
  'Other products': { reader: 'someone looking for something useful', pain: 'The things you use every day should be easy to live with.', want: 'something useful that lasts' },
};

export const slugify = (s) => s.toLowerCase().replace(/['’]/g, '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
const clean = (s) => String(s ?? '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li)>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"')
  .replace(/[–—]/g, ', ').replace(/[ \t]+/g, ' ').replace(/ ?\n ?/g, '\n').replace(/\n{2,}/g, '\n').trim();
const sentences = (s) => clean(s).split(/\n|(?<=[.!?])\s+(?=[A-Z])/).map(x => x.trim().replace(/^[-•*]\s*/, '')).filter(x => x.length > 2);
const metaDesc = (s) => { const t = clean(s); if (t.length <= 158) return t; const cut = t.slice(0, 158); const dot = cut.lastIndexOf('. '); return dot > 80 ? cut.slice(0, dot + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`; };
const list = (xs) => xs.length <= 1 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
const lc = (s) => /^[A-Z]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);
const uc = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const sentenceCase = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const pick = (id, arr, salt = '') => arr[hash(`${id}${salt}`) % arr.length];
const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL', '5XL', '6XL', 'YXS', 'YS', 'YM', 'YL', 'YXL'];
const sortSizes = (xs) => [...xs].sort((a, b) => { const ia = SIZE_ORDER.indexOf(a.toUpperCase()), ib = SIZE_ORDER.indexOf(b.toUpperCase()); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b, undefined, { numeric: true }); });
const days = (n) => `${n} business day${n === 1 ? '' : 's'}`;

// Supplier language a shopper should never read. Sentences and features that contain it are dropped.
export const SELLER = /\b(custom\w*|personali[sz]\w*|print\w*|design\w*|blanks?|merch\w*|sellers?|store|stores|shop owners?|brand\w*|rebrand\w*|re-?label\w*|best-?sellers?|profit\w*|dtg|dtf|sublimat\w*|decorat\w*|embroider\w*|logos?|business(?! days?)\w*|promotional|resale|wholesale|retail\w*|e-?commerce|age restrictions?|compliance|disclaimer|ink|canvas for|your artwork|artwork|on-demand|on demand|fulfil\w*|catalog\w*|variant\w*|sku|mockup\w*)\b/i;

// What a feature means for the person using it. First matching rule wins per feature; each key is
// used once per product. `tag` feeds the story headline.
const BENEFITS = [
  { key: 'preshrunk', re: /pre-?shrunk|preshrunk/, tag: 'shrink', h: 'It is preshrunk', line: 'The fabric is preshrunk, so the size you order is much closer to the size you keep after washing.' },
  { key: 'tagless', re: /tear[- ]?away|tag[- ]?free|tagless|removable (tag|label)|no tag/, tag: 'tag', h: 'No scratchy tag', line: 'There is no scratchy tag at the back of your neck: the label tears out or is printed inside.' },
  { key: 'wicking', re: /moisture|wick|quick[- ]dry|breathab/, tag: 'sweat', h: 'It handles sweat', line: 'The fabric moves sweat away from your skin, so it dries faster than plain cotton.' },
  { key: 'noseams', re: /without side seams|no side seams|tubular|seamless body/, tag: 'seams', h: 'No side seams', line: 'It is knitted in one piece with no side seams, so there is nothing to rub along your sides.' },
  { key: 'sideseams', re: /with side seams|side[- ]seam/, h: 'Side seams for a cleaner shape', line: 'It has side seams, which give it a more tailored shape than a tube-knit piece.' },
  { key: 'shoulders', re: /shoulder.{0,20}tap|taping|taped/, h: 'Shoulders that hold their shape', line: 'The shoulder seams are taped, so the neckline and shoulders keep their shape instead of stretching out.' },
  { key: 'collar', re: /rib\w*.{0,20}(collar|neck)|(collar|neck).{0,20}rib/, h: 'A collar that springs back', line: 'The ribbed collar springs back after you pull it on, so the neckline does not go wavy.' },
  { key: 'stitching', re: /double[- ]needle|twin[- ]needle|double[- ]stitch|reinforced/, h: 'Stitching that does not unravel', line: 'Hems and seams are double stitched, which is where cheaper pieces usually come apart first.' },
  { key: 'combed', re: /ring[- ]?spun|combed/, tag: 'soft', h: 'Smoother cotton', line: 'It uses combed, ring-spun cotton, which feels smoother and softer than basic cotton.' },
  { key: 'organic', re: /organic/, tag: 'organic', h: 'Organic cotton', line: 'It is made with organic cotton.' },
  { key: 'fleece', re: /fleece|brushed|sherpa|plush|soft[- ]?touch/, tag: 'soft', h: 'Soft on the inside', line: 'The inside is brushed or fleecy, so it feels soft and warm against your skin.' },
  { key: 'relaxed', re: /relaxed|oversized|boxy|loose fit|dropped shoulder/, tag: 'fit', h: 'A relaxed fit', line: 'It is cut with a relaxed fit, so it sits easy rather than clingy.' },
  { key: 'slim', re: /slim fit|fitted|tailored fit|athletic fit/, h: 'A slimmer fit', line: 'It is cut slimmer than a classic fit, so size up if you like room.' },
  { key: 'stretch', re: /spandex|elastane|lycra|(two|2|four|4)-way stretch|stretchy|stretchable/, tag: 'stretch', h: 'It stretches with you', line: 'There is stretch in the fabric, so it moves with you.' },
  { key: 'hood', re: /hood|drawstring|drawcord/, h: 'Hood and drawstrings', line: 'It has a hood with drawstrings you can pull in when it gets cold.' },
  { key: 'pocket', re: /pocket/, h: 'Pockets', line: 'It has pockets for your phone, keys or hands.' },
  { key: 'cuffs', re: /cuff|waistband|rib\w* (hem|waist)/, h: 'Cuffs and hem that grip', line: 'Ribbed cuffs and hem hold their shape and keep the cold out.' },
  { key: 'raglan', re: /raglan/, h: 'Easy arm movement', line: 'Raglan sleeves run up to the collar, which gives your arms more room to move.' },
  { key: 'zip', re: /\bzip|zipper/, h: 'Zip closure', line: 'It zips, so it is quick to get on and off.' },
  { key: 'adjust', re: /adjustable|snapback|strap|buckle|velcro|hook and loop|drawcord/, tag: 'fit', h: 'Adjusts to fit', line: 'It adjusts, so you can get the fit right without guessing a size.' },
  { key: 'water', re: /water[- ]?(proof|resistant|repellent)|weatherproof/, tag: 'water', h: 'It copes with water', line: 'It is water resistant, so a spill or a shower of rain is not a problem.' },
  { key: 'dishwasher', re: /dishwasher/, tag: 'easy', h: 'Dishwasher safe', line: 'It goes in the dishwasher, so there is no hand washing.' },
  { key: 'microwave', re: /microwave/, h: 'Microwave safe', line: 'It is microwave safe, so you can warm a drink up in it.' },
  { key: 'insulated', re: /insulat|double[- ]wall|vacuum/, tag: 'temp', h: 'It keeps drinks hot or cold', line: 'It is double walled and insulated, so drinks stay hot or cold for longer than in a normal cup.' },
  { key: 'steel', re: /stainless/, h: 'Stainless steel', line: 'It is stainless steel, so it will not rust.' },
  { key: 'lid', re: /\blid\b/, h: 'It has a lid', line: 'It comes with a lid, so it travels without spilling everywhere.' },
  { key: 'ceramic', re: /ceramic|porcelain|stoneware/, h: 'Proper ceramic', line: 'It is ceramic, so it feels solid in your hand and does not hold on to flavours.' },
  { key: 'glass', re: /\bglass\b/, h: 'Glass', line: 'It is glass, so you can see what is inside.' },
  { key: 'hang', re: /ready to hang|hanging|hanger|mounting|sawtooth|wall mount|hooks? included/, tag: 'hang', h: 'Ready to hang', line: 'It comes ready to hang, so there is no trip to the framer.' },
  { key: 'frame', re: /\bframe/, h: 'It comes framed', line: 'It comes in a frame, so it is ready for the wall.' },
  { key: 'matte', re: /matte|matt finish|non-?glare|anti-?glare/, h: 'A matte finish', line: 'The matte finish means no glare from windows or lamps.' },
  { key: 'gloss', re: /gloss/, h: 'A glossy finish', line: 'The glossy finish makes colours look rich and bright.' },
  { key: 'fade', re: /fade[- ]?resist|uv[- ]?resist|won.t fade|colou?r[- ]?fast|vibrant/, tag: 'colour', h: 'Colours that stay bright', line: 'The colours are made to stay bright rather than fade quickly.' },
  { key: 'protect', re: /impact|shock|protect|drop|bumper|scratch/, tag: 'protect', h: 'Built to protect', line: 'It is built to protect what is inside from knocks and scratches.' },
  { key: 'charging', re: /wireless charg|magsafe|qi\b/, h: 'Works with wireless charging', line: 'You do not have to take it off to charge wirelessly.' },
  { key: 'nonslip', re: /non-?slip|anti-?slip|rubber(ized)? back|grip/, h: 'It stays put', line: 'The underside grips, so it stays where you put it.' },
  { key: 'washable', re: /machine wash|washable/, tag: 'easy', h: 'It goes in the washing machine', line: 'It goes in the washing machine, so keeping it clean is easy.' },
  { key: 'light', re: /lightweight|light weight/, h: 'Light', line: 'It is light, so you barely notice it.' },
  { key: 'durable', re: /durab|heavy[- ]duty|sturdy|thick|robust|tough|long[- ]lasting/, tag: 'tough', h: 'Made to last', line: 'It is made from sturdy, hard-wearing materials.' },
];
// Words a shopper should not meet in a finished post (what the ICP simulation counts as jargon).
export const JARGON = /\b(blanks?|print providers?|print areas?|print[- ]on[- ]demand|your designs?|custom designs?|customi[sz]\w*|personali[sz]\w*|merch\w*|sellers?|rebrand\w*|re-?label\w*|dtg|dtf|sublimat\w*|decoration methods?|profit\w*|wholesale|resale|printify|best-?sellers?|promotional|mockups?)\b/i;
const LEAD = { 'Phone and tech': ['protect', 'charging', 'nonslip'], 'Mugs and drinkware': ['insulated', 'dishwasher', 'microwave', 'ceramic', 'lid', 'steel'], 'Wall art': ['hang', 'frame', 'matte', 'gloss'], 'Bags': ['water', 'pocket', 'zip', 'adjust', 'stitching'], 'Hats': ['adjust', 'fit'], 'Kitchen and dining': ['dishwasher', 'washable', 'water'], 'Home textiles': ['washable', 'fleece', 'soft'] };
const MATERIAL = /fiber|fibre|fabric|material|composition|cotton|polyester|weight|nylon|linen|wool|leather|ceramic|steel|paper|vinyl|bamboo|silk|rayon|viscose/i;

// Normalised facts for one product (everything a post can say).
export function facts(raw) {
  const b = raw.blueprint;
  const title = clean(b.title);
  const brand = clean(b.brand || ''), model = clean(b.model || '');
  const category = categoryOf(title);
  // Words that identify the manufacturer: never shown to shoppers.
  const ids = [brand && !/generic|printify/i.test(brand) ? brand : '', model].filter(x => x && x.length > 1);
  const idRe = ids.length ? new RegExp(`\\b(${ids.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'i') : null;
  const shopperSafe = (s) => !SELLER.test(s) && !(idRe && idRe.test(s)) && !/printify/i.test(s);
  const plain = (title.replace(/[™®©]/g, '').replace(/\b\d{3,5}[A-Z]{0,2}\b(?!\s?(oz|ml|in|cm|"|x))\s*/g, '').replace(/\b(uv dtf|uv-dtf|sublimation|sublimated|dtg|dtf|aop|blank|promotional)\b\s*/gi, '').replace(/\s*\([^)]*\)\s*/g, ' ').replace(idRe || /$^/, '').replace(/\bunisex\s+/i, '').replace(/\s{2,}/g, ' ').trim() || title)
    .split(' ').map(w => /\d|^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase()).join(' ');
  const colours = [...new Set((raw.variants || []).map(v => v.o?.color).filter(Boolean))];
  const sizes = sortSizes([...new Set((raw.variants || []).map(v => v.o?.size).filter(Boolean).map(x => x.replace(/″|''|”/g, '"').replace(/\s*\((vertical|horizontal|square)\)/i, ' $1').replace(/\s+/g, ' ').trim()))]);
  const provs = (raw.providers || []).filter(p => p.title);
  // Production time: the usual provider's average (or the median across providers), rounded up to
  // whole business days so we never promise faster than is typical.
  const top = provs.find(p => p.id === raw.top_provider_id);
  const times = (top?.production_time?.average ? [top.production_time.average] : provs.map(p => p.production_time?.average)).filter(x => typeof x === 'number').sort((a, c) => a - c);
  const countries = [...new Set(provs.map(p => p.location?.country).filter(Boolean))];
  const allFeatures = (b.features || []).filter(f => f.name && f.description).map(f => ({ name: clean(f.name), text: clean(f.description) }));
  const features = allFeatures.filter(f => shopperSafe(f.name) && !/country of origin|compliance|age restriction/i.test(f.name))
    .map(f => ({ ...f, text: sentences(f.text).filter(shopperSafe).join(' ') })).filter(f => f.text);
  const material = features.filter(f => MATERIAL.test(f.name));
  const build = features.filter(f => !material.includes(f));
  // Benefits are read from the product's features and care only; descriptions are too loose
  // ("relaxed wear" is not a relaxed fit).
  const blob = `${title} ${allFeatures.map(f => `${f.name} ${f.text}`).join(' ')} ${(b.care_instructions || []).join(' ')}`.toLowerCase();
  const used = new Set();
  const benefits = BENEFITS.filter(x => { if (used.has(x.key) || !x.re.test(blob) || (x.key === 'sideseams' && used.has('noseams'))) return false; used.add(x.key); return true; })
    .filter(x => WEARABLE.has(category) || !['preshrunk', 'noseams', 'sideseams', 'shoulders', 'collar', 'raglan', 'cuffs', 'hood'].includes(x.key));
  // Lead with what this kind of buyer cares about most (protection for a case, not colour).
  const lead = LEAD[category] || [];
  benefits.sort((x, y) => (lead.includes(x.key) ? lead.indexOf(x.key) : 50) - (lead.includes(y.key) ? lead.indexOf(y.key) : 50));
  // Kids clothes are read by a parent: talk about the child, not the reader.
  if (category === 'Kids and baby') for (const [i, x] of benefits.entries()) benefits[i] = { ...x, line: x.line.replace(/\byour (neck|sides|skin|arms|hands)\b/g, 'their $1').replace(/moves with you/g, 'moves with them').replace(/you barely notice/g, 'they barely notice') };
  const oz = (/(\d+(?:\.\d+)?)\s*oz\.?\s*\/\s*y(?:d|ard)/i.exec(blob) || /(\d+(?:\.\d+)?)\s*oz/i.exec(material.map(m => m.text).join(' ')) || [])[1];
  const weight = oz && WEARABLE.has(category) ? Number(oz) : null;
  const comp = (/(\d{2,3}%\s*[a-z-]+(?:\s*(?:,|and|\/)\s*\d{1,3}%\s*[a-z-]+)*)/i.exec(material.map(m => m.text).join(' ') + ' ' + blob) || [])[1];
  const notes = sentences(b.description || '').filter(s => /may (appear|vary|differ)|flecks?|slight(ly)? (vary|different)|not recommended|hand wash only|do not|avoid/i.test(s) && shopperSafe(s) && !/\b(we|our|us|guarantee)\b/i.test(s)).slice(0, 2);
  return {
    id: b.id, title, plain, brand, model, category, image: (b.images || [])[0] || null,
    description: sentences(b.description || '').filter(shopperSafe).slice(0, 4), material, build, benefits, weight, comp: comp ? comp.replace(/\s+/g, ' ') : null, notes,
    care: careLines((b.care_instructions || []).map(clean).filter(Boolean).map(c => c.replace(/\b(the |your )?(design|print|imprint|decoration|printed area)s?\b/gi, 'the graphic')).filter(shopperSafe)),
    colours, sizes, fastest: times.length ? Math.max(1, Math.ceil(times[Math.floor(times.length / 2)])) : null, madeIn: countries.length === 1 ? COUNTRY[countries[0]] || countries[0] : null,
    guide: raw.sizes && raw.sizes.sizes?.length && raw.sizes.types?.length ? raw.sizes : null, handling: raw.shipping?.handling || null,
    wearable: WEARABLE.has(category), icp: ICP[category] || ICP['Other products'],
  };
}

function sizeTable(f) {
  if (!f.guide) return null;
  const types = f.guide.types.filter(t => t.ranges?.length && !/printify|sensaria|provider|tolerance/i.test(t.name));
  if (!types.length) return null;
  // Size guides give lengths in millimetres; shown in inches for US shoppers.
  const conv = (t, v) => { if (!v) return ''; const n = parseFloat(v); return t.units === 'length' && Number.isFinite(n) ? String(Number((n / 25.4).toFixed(1))) : v; };
  const head = ['Size', ...types.map(t => { const n = sentenceCase(t.name).replace(/print(able)? area/gi, 'picture area'); return t.units !== 'length' ? n : /\)$/.test(n) ? n.replace(/\)$/, ', in)') : `${n} (in)`; })];
  const sold = new Set(f.sizes.map(x => x.toUpperCase()));
  const rows = f.guide.sizes.map((s, i) => [s.replace(/″|''|”/g, '"'), ...types.map(t => { const r = t.ranges[i] || {}; const a = conv(t, r.from), b = conv(t, r.to); return a && b && a !== b ? `${a}-${b}` : (a || b || '-'); })]).filter(r => !f.sizes.length || sold.has(r[0].toUpperCase()) || !isLetterSizes(f));
  return rows.length ? { head, rows } : null;
}
// Clothing sizes (S, M, L...) read as a range; anything else (capacities, dimensions, phone models)
// is listed, because "iPhone 13 to Galaxy S22" is not a range.
const isLetterSizes = (f) => f.sizes.length > 1 && f.sizes.every(x => SIZE_ORDER.includes(x.toUpperCase()) || /^\d{1,2}(T|Y|M)$|^\d{1,2}-\d{1,2}(Y|M)$|^(NB|newborn)$/i.test(x));
const oneSize = (f) => f.sizes.length <= 1;
const sizeRange = (f) => {
  if (!f.sizes.length) return null;
  if (oneSize(f)) return /one size/i.test(f.sizes[0]) ? 'one size' : `one size (${f.sizes[0]})`;
  if (isLetterSizes(f)) return `sizes ${f.sizes[0]} to ${f.sizes[f.sizes.length - 1]}`;
  if (f.category === 'Phone and tech') return `${f.sizes.length} models, including ${list(f.sizes.slice(-3))}`;
  return f.sizes.length <= 6 ? list(f.sizes) : `${f.sizes.length} sizes, from ${f.sizes[0]} to ${f.sizes[f.sizes.length - 1]}`;
};
// Care labels arrive as codes ("Machine wash: cold"). Rewrite them as instructions, in wash order.
const CARE_ORDER = [/wash/i, /bleach/i, /dry(?! ?clean)/i, /iron|steam/i, /dry ?clean/i];
export function careLines(raw) {
  return raw.map(c => c.replace(/\.+$/, '').replace(/^suggested to /i, '').replace(/^non-?chlorine:?\s*bleach as needed/i, 'Use non-chlorine bleach only if needed')
    .replace(/^iron, steam or dry:?\s*/i, 'Iron or steam on ').replace(/^do not dry ?clean/i, 'Do not dry clean')
    .replace(/^(machine wash|hand wash|tumble dry|line dry|iron|wash|dry):\s*/i, '$1 ').replace(/\s{2,}/g, ' ').trim())
    .filter(Boolean).map(uc)
    .sort((a, b) => { const r = (x) => { const i = CARE_ORDER.findIndex(re => re.test(x)); return i < 0 ? 9 : i; }; return r(a) - r(b); });
}
const washTemp = (f) => /\b(hot|60 ?c|140 ?f)\b/i.test(f.care.join(' ')) ? 'hot' : /\b(warm|40 ?c|105 ?f)\b/i.test(f.care.join(' ')) ? 'warm' : 'cold';
const dryHow = (f) => { const t = f.care.join(' '); return /line dry|hang|air dry|do not tumble/i.test(t) ? 'hang it to dry' : /tumble dry:? ?(medium)/i.test(t) ? 'tumble dry on medium' : 'tumble dry on low'; };
const shrinkAnswer = (f) => has(f, 'preshrunk')
  ? `It is preshrunk, so it should stay very close to the size you order. Follow the care label (wash ${washTemp(f)}, ${dryHow(f)}) to keep it that way.`
  : `It is not sold as preshrunk. Follow the care label (wash ${washTemp(f)}, ${dryHow(f)}) and it should hold its size; a hot dryer is what shrinks most fabrics.${/100%\s*cotton/i.test(f.comp || '') ? ' All-cotton is the most likely to shrink, so skip the high heat.' : ''}`;
const weightWord = (w) => !w ? null : w >= 6 ? 'heavyweight' : w >= 5 ? 'midweight' : 'lightweight';
const has = (f, k) => f.benefits.some(b => b.key === k);
// How long until it ships: made after the order is placed.
const makeLine = (f) => f.fastest ? `We make it after you order, which usually takes about ${days(f.fastest)}${f.madeIn ? ` in ${f.madeIn}` : ''}, then it ships. Your shipping cost and delivery estimate show at checkout before you pay.` : null;
const coloursLine = (f) => f.colours.length > 1 ? `It comes in ${f.colours.length} colours: ${list(f.colours.slice(0, 12))}${f.colours.length > 12 ? `, and ${f.colours.length - 12} more` : ''}.` : f.colours.length ? `It comes in ${f.colours[0]}.` : null;
const fabricLine = (f) => {
  const bits = [];
  if (f.comp) bits.push(`It is ${f.comp.toLowerCase()}`);
  else if (f.material.length) bits.push(f.material[0].text.replace(/\.$/, ''));
  if (f.weight) bits.push(`${bits.length ? 'and' : 'It is'} ${weightWord(f.weight)} at ${f.weight} oz per square yard${f.weight >= 6 ? ', thick enough that it is not see-through' : f.weight < 4.5 ? ', which keeps it cool but means light colours can show what is underneath' : ''}`);
  if (!bits.length) return null;
  const s = `${bits.join(' ')}.`;
  const why = /100%\s*cotton/i.test(f.comp || '') ? ' All-cotton is soft and breathable, and it can shrink a little in a hot dryer, so dry it low.'
    : /polyester/i.test(f.comp || '') && /cotton/i.test(f.comp || '') ? ' The blend gives you cotton softness with less shrinking and fewer wrinkles.'
    : /100%\s*polyester/i.test(f.comp || '') ? ' Polyester holds its colour, dries quickly and barely wrinkles.' : '';
  return s.replace(/\.\./g, '.') + why;
};

// Honest limits: who should not buy it. Only things the facts support.
function skipFor(f) {
  const out = [];
  const care = f.care.join(' ');
  if (f.wearable && /100%\s*cotton/i.test(f.comp || '') && !has(f, 'preshrunk')) out.push('you tumble dry everything on hot: all-cotton can shrink a little');
  if (f.wearable && /100%\s*polyester/i.test(f.comp || '')) out.push('you want the feel of cotton: this is polyester');
  if (/acrylic/i.test(f.comp || '')) out.push('you only wear natural fibres: this is acrylic');
  if (f.weight && f.weight >= 6) out.push('you run hot: heavier fabric is warmer');
  if (f.weight && f.weight < 4.5) out.push('you want something thick and structured: this is a light fabric');
  if (has(f, 'slim')) out.push('you like a loose fit, unless you size up');
  if (has(f, 'relaxed')) out.push('you want a close, fitted look');
  if (/hand wash only/i.test(care) || (/hand wash/i.test(care) && !/machine/i.test(care))) out.push('you want to throw it in the machine: it is hand wash only');
  if (f.category === 'Mugs and drinkware' && !has(f, 'dishwasher') && /hand wash|not dishwasher/i.test(`${care} ${f.description.join(' ')}`)) out.push('you want to use the dishwasher: wash it by hand');
  if ((f.category === 'Hats' || f.wearable) && oneSize(f) && f.sizes.length) out.push('you are well above or below average size: it only comes in one size, so check the measurements');
  if (f.category === 'Phone and tech' && f.sizes.length > 1) out.push('your exact model is not on the list: these are made to fit specific models only');
  if (f.category === 'Bags' && !/\b\d+\s?(lb|lbs|kg)\b/i.test(f.material.concat(f.build).map(x => x.text).join(' '))) out.push('you need to carry heavy loads: there is no weight rating for it');
  for (const n of f.notes) out.push(`small details bother you: ${lc(n.replace(/\.$/, ''))}`);
  return out.slice(0, 4);
}
// The wait is the one catch every product has; it is said once, plainly, not dressed up as a list.
const waitLine = (f) => f.fastest ? `It is made to order, so allow about ${days(f.fastest)} for it to be made before it ships. If you need it this week, this is not the one.` : null;
const limitsBlock = (f, h) => { const skip = skipFor(f); const w = waitLine(f);
  if (skip.length) return { h, p: 'It is not for everyone. Skip it if:', bullets: [...skip.map(uc), ...(w ? [uc(`you need it this week: allow about ${days(f.fastest)} for it to be made before it ships`)] : [])] };
  return w ? { h: 'The one catch', p: `${w} Your shipping cost and delivery estimate show at checkout before you pay.` } : null; };

function faqFor(f) {
  const faq = [];
  const tbl = sizeTable(f);
  if (f.wearable && isLetterSizes(f)) faq.push({ q: 'What size should I get?', a: `It comes in ${sizeRange(f)}.${tbl ? ' Measure something that fits well and compare it with the size chart. Between sizes? Go up one.' : ''}${has(f, 'slim') ? ' It is cut slim, so size up for a looser fit.' : has(f, 'relaxed') ? ' It is cut relaxed, so stay true to size unless you want it oversized.' : ''}` });
  else if (f.sizes.length) faq.push({ q: f.category === 'Phone and tech' ? 'Will it fit my phone?' : 'What size is it?', a: f.category === 'Phone and tech' && f.sizes.length > 1 ? `It is made for ${f.sizes.length} models: ${list(f.sizes.slice(0, 10))}${f.sizes.length > 10 ? ', and more' : ''}. Pick your exact model; a case for another model will not fit.` : `It comes in ${sizeRange(f)}.${tbl ? ' The full measurements are in the buying guide.' : ''}` });
  if (f.wearable) faq.push({ q: 'Will it shrink?', a: shrinkAnswer(f) });
  if (f.weight) faq.push({ q: 'Is it see-through?', a: f.weight >= 6 ? `No. At ${f.weight} oz it is a thick fabric.` : f.weight >= 5 ? `Not in most colours. At ${f.weight} oz it is a midweight fabric; white and very light colours show the most.` : `It is a light ${f.weight} oz fabric, so white and pale colours can be a little see-through.` });
  if (f.comp || f.material.length) faq.push({ q: 'What is it made of?', a: fabricLine(f) || f.material.map(m => m.text.replace(/\.$/, '')).join('. ') + '.' });
  if (f.care.length) faq.push({ q: f.wearable || /wash/i.test(f.care.join(' ')) ? 'How do I wash it?' : 'How do I clean it?', a: f.care.slice(0, 5).join('. ') + '.' });
  else if (has(f, 'dishwasher')) faq.push({ q: 'Can it go in the dishwasher?', a: 'Yes, it is dishwasher safe.' });
  if (f.fastest) faq.push({ q: 'How long does it take to arrive?', a: `It is made after it is ordered, which takes about ${days(f.fastest)}. Then it ships, and the delivery estimate shows at checkout before you pay.` });
  return faq;
}

// ---------- buying guide: "N things to know before you buy" ----------
function listicle(f, ctx) {
  const items = [];
  const name = f.display;
  const table = sizeTable(f);
  if (f.wearable && isLetterSizes(f)) items.push({ h: 'Which size to get', p: [`It comes in ${sizeRange(f)}.`, has(f, 'slim') ? 'It is cut slim, so size up if you like room.' : has(f, 'relaxed') ? 'It is cut relaxed, so it already has room. Stay true to size.' : '', table ? `The measurements below are in inches, taken with the garment laid flat. Lay out something ${f.category === 'Kids and baby' ? 'your child wears' : 'you own'} that fits well and compare. Between sizes? Go up one.` : ''].filter(Boolean).join(' '), table });
  else if (f.category === 'Phone and tech' && f.sizes.length > 1) items.push({ h: 'Check your model first', p: `It is made for ${f.sizes.length} models, and each one fits only that model:`, bullets: f.sizes.slice(0, 24).concat(f.sizes.length > 24 ? [`and ${f.sizes.length - 24} more`] : []) });
  else if (f.sizes.length || table) items.push({ h: oneSize(f) ? 'How big it is' : 'Sizes', p: [sizeRange(f) && `It comes in ${sizeRange(f)}.`, table ? 'Measurements in inches:' : ''].filter(Boolean).join(' '), table });
  const fab = fabricLine(f);
  if (fab) items.push({ h: f.wearable ? 'How it feels' : 'What it is made of', p: fab });
  if (f.wearable) items.push({ h: 'Will it shrink?', p: shrinkAnswer(f) });
  const extra = f.benefits.filter(b => !['preshrunk'].includes(b.key)).slice(0, 6);
  if (extra.length) items.push({ h: 'The details that make the difference', bullets: extra.map(b => b.line) });
  if (coloursLine(f)) items.push({ h: f.colours.length > 1 ? `${f.colours.length} colours to pick from` : 'The colour', p: coloursLine(f) });
  if (f.care.length) items.push({ h: 'How to look after it', bullets: f.care.slice(0, 6) });
  if (makeLine(f)) items.push({ h: 'How long it takes to reach you', p: makeLine(f) });
  const lim = limitsBlock(f, 'Who should skip it'); if (lim && lim.bullets) items.push(lim); // the wait alone is already covered above
  if (items.length < 3) return null;

  const n = items.length;
  const specs = [f.comp && !f.display.toLowerCase().includes(f.comp.toLowerCase()) && f.comp.toLowerCase(), f.sizes.length && sizeRange(f), f.colours.length > 1 && `${f.colours.length} colours`].filter(Boolean);
  const answer = [`${f.plural ? 'These are' : `This is ${f.article}`} ${name}${specs.length ? `: ${list(specs)}` : ''}.`,
    f.benefits[0] ? f.benefits[0].line : f.description[0] || '',
    f.fastest ? `It is made to order in about ${days(f.fastest)}.` : ''].filter(Boolean).join(' ');
  const teaser = `Here are the ${n} things worth checking before you buy, including who should skip it.`;
  const T = uc(name);
  const seo = [`${T}: ${n} things to know before you buy`, `${T}: what to know before you buy`, `${T} buying guide`, T.slice(0, 60)].find(s => s.length <= 60);
  return {
    type: 'listicle', slug: `${ctx.base}-buying-guide`, blueprint_id: f.id, category: f.category, image: f.image,
    title: `The ${lc(name)}: ${n} things to know before you buy`, seo_title: seo,
    description: metaDesc(answer), intro: [answer, teaser], items, faq: faqFor(f), sibling: `${ctx.base}-story`,
  };
}

// Story headline: the strongest benefit this product can honestly claim, in the reader's words.
function headline(f) {
  const n = lc(f.display);
  const s = f.plural ? '' : 's', is = f.plural ? 'are' : 'is';
  const tags = new Set(f.benefits.map(b => b.tag).filter(Boolean));
  const opts = [];
  if (tags.has('shrink')) opts.push(`The ${n} that stay${s} the size you bought`);
  if (f.weight >= 6) opts.push(`The ${n} that ${is} thick enough to skip the undershirt`);
  if (tags.has('tag')) opts.push(`The ${n} with no scratchy tag`);
  if (tags.has('sweat')) opts.push(`The ${n} that move${s} sweat off your skin`);
  if (tags.has('temp')) opts.push(`The ${n} that keep${s} drinks hot or cold`);
  if (tags.has('easy') && f.category === 'Mugs and drinkware') opts.push(`The ${n} that go${f.plural ? '' : 'es'} straight in the dishwasher`);
  if (tags.has('hang')) opts.push(`The ${n} that arrive${s} ready to hang`);
  if (tags.has('water')) opts.push(`The ${n} that shrug${s} off spills and rain`);
  if (tags.has('protect')) opts.push(`The ${n} built to take the knocks`);
  if (tags.has('soft')) opts.push(`The ${n} that feel${s} soft from the first wear`);
  if (tags.has('stretch')) opts.push(`The ${n} that move${s} when you do`);
  if (tags.has('fit')) opts.push(`The ${n} that ${is} easy to get a good fit in`);
  if (tags.has('colour')) opts.push(`The ${n} with colours that stay bright`);
  if (f.icp.gift) opts.push(`The ${n}: an easy gift that gets used`);
  if (tags.has('easy')) opts.push(`The ${n} that ${is} easy to keep clean`);
  if (tags.has('tough')) opts.push(`The ${n} made to be used, not babied`);
  opts.push(`Why we sell the ${n}`, `What you get with the ${n}`);
  // Two strong options per product, alternated, so neighbouring products do not share a headline.
  return opts.length > 3 ? opts[hash(f.id) % 2] : opts[0];
}

// ---------- story: problem, what is different, fit, limits, decision ----------
function advertorial(f, ctx) {
  if (!f.benefits.length && !f.material.length && !f.description.length) return null;
  const name = lc(f.display);
  const sections = [];
  sections.push({ h: 'The problem', p: `${f.icp.pain} What you actually want is ${f.icp.want}.` });
  const fit = f.wearable && isLetterSizes(f);
  const mech = f.benefits.slice(0, 5).map(b => b.line);
  const fab = fabricLine(f);
  if (fab || mech.length) sections.push({ h: `What is different about this ${f.noun}`, p: [fab, ...mech.slice(0, fab ? 2 : 3)].filter(Boolean).join(' '), bullets: mech.length > (fab ? 2 : 3) ? mech.slice(fab ? 2 : 3) : undefined });
  else if (f.description.length) sections.push({ h: `What the ${name} is`, p: f.description.slice(0, 3).join(' ') });
  if (fit) sections.push({ h: 'Getting the size right', p: `It comes in ${sizeRange(f)}.${has(f, 'slim') ? ' It is cut slim, so size up if you like room.' : has(f, 'relaxed') ? ' It is cut relaxed, so stay true to size.' : ''}${sizeTable(f) ? ' The buying guide has the full size chart in inches.' : ''} Between sizes? Go up one.` });
  else if (f.category === 'Phone and tech' && f.sizes.length > 1) sections.push({ h: 'Check your model', p: `It is made for ${f.sizes.length} specific models, including ${list(f.sizes.slice(-3))}. The guide lists them all.` });
  else if (f.sizes.length) sections.push({ h: 'Size', p: `It comes in ${sizeRange(f)}.` });
  if (coloursLine(f)) sections.push({ h: 'Colours', p: coloursLine(f) });
  const lim = limitsBlock(f, 'Where it falls short'); if (lim) sections.push(lim);
  if (makeLine(f) && lim?.bullets) sections.push({ h: 'Made after it is ordered', p: `Nothing sits in a warehouse. ${makeLine(f)}` });
  const inGuide = [fit && sizeTable(f) && 'the size chart', f.category === 'Phone and tech' && f.sizes.length > 1 && 'every model it fits', f.care.length && 'care instructions', f.colours.length > 1 && 'every colour'].filter(Boolean);
  sections.push({ h: `Should you get the ${name}?`, p: `Get it if you want ${f.icp.want}.${f.icp.gift ? ' It also makes an easy gift.' : ''}${inGuide.length ? ` The buying guide has ${list(inGuide)}.` : ''}` });
  const dek = [`${f.plural ? 'These are' : `This is ${f.article}`} ${name}${f.sizes.length ? `, in ${sizeRange(f)}` : ''}.`, f.benefits[0] ? f.benefits[0].line : fab || f.description[0] || ''].filter(Boolean).join(' ');
  const title = headline(f);
  return {
    type: 'advertorial', slug: `${ctx.base}-story`, blueprint_id: f.id, category: f.category, image: f.image,
    kicker: 'From the Shelby team', title, seo_title: title.length <= 60 ? title : `Why we sell the ${name}`.slice(0, 60), description: metaDesc(dek),
    dek, sections, faq: faqFor(f).slice(0, 4), sibling: `${ctx.base}-buying-guide`,
  };
}

const NOUN = [[/hoodie|hooded/, 'hoodie'], [/sweatshirt|crewneck|pullover/, 'sweatshirt'], [/t-shirt|\btee\b/, 'tee'], [/tank/, 'tank'], [/polo/, 'polo'], [/shirt/, 'shirt'], [/jogger|sweatpant/, 'joggers'], [/short/, 'shorts'], [/legging/, 'leggings'], [/dress/, 'dress'], [/jacket/, 'jacket'], [/beanie/, 'beanie'], [/\bhat\b|\bcap\b/, 'hat'], [/sock/, 'socks'], [/mug/, 'mug'], [/tumbler/, 'tumbler'], [/bottle/, 'bottle'], [/poster/, 'poster'], [/canvas/, 'canvas'], [/pillow|cushion/, 'pillow'], [/blanket|throw/, 'blanket'], [/towel/, 'towel'], [/tote/, 'tote'], [/backpack/, 'backpack'], [/bag/, 'bag'], [/case/, 'case'], [/sticker/, 'sticker'], [/notebook|journal/, 'notebook']];
const nounOf = (t) => (NOUN.find(([re]) => re.test(t.toLowerCase())) || [null, 'piece'])[1];

// All posts for all products, with related-post links inside each category.
export function buildPosts(raws) {
  const fs = raws.filter(r => r?.blueprint?.title).map(facts);
  // Some products share a plain name: tell them apart by what is actually different.
  const groups = new Map(); for (const f of fs) { const k = f.plain.toLowerCase(); groups.set(k, [...(groups.get(k) || []), f]); }
  for (const g of groups.values()) {
    g.forEach((f, i) => {
      let d = f.plain.replace(/^(.+?),?\s+(\d+(?:\.\d+)?\s?oz)$/i, '$2 $1');
      if (g.length > 1) {
        const q = [weightWord(f.weight), f.comp && f.comp.length < 30 ? f.comp.toLowerCase() : null, f.sizes.length > 1 ? `${f.sizes[0]}-${f.sizes[f.sizes.length - 1]}` : null].filter(Boolean);
        const unique = q.find(x => g.filter(o => o !== f).every(o => ![weightWord(o.weight), o.comp?.toLowerCase(), o.sizes.length > 1 ? `${o.sizes[0]}-${o.sizes[o.sizes.length - 1]}` : null].includes(x)));
        d = unique ? `${d} (${unique})` : `${d} (style ${i + 1})`;
      }
      f.display = d; f.noun = nounOf(f.plain); f.article = /^([aeiou]|8|11\D|18\D)/i.test(d) ? 'an' : 'a';
      const last = f.plain.split(' ').pop().toLowerCase();
      f.plural = /[^s]s$/.test(last) && !['canvas', 'bus', 'gas', 'chess', 'lens', 'plus', 'atlas'].includes(last);
    });
  }
  const usedSlugs = new Set(), all = [];
  for (const f of fs) {
    let base = slugify(f.display);
    if (usedSlugs.has(base)) base = `${base}-${f.id}`;
    usedSlugs.add(base);
    // Old addresses (brand + model in the slug) keep working through `aliases`.
    const old = slugify(f.brand && f.model && !/generic/i.test(f.brand) ? `${f.brand} ${f.model} ${f.title}` : f.title);
    for (const p of [listicle(f, { base }), advertorial(f, { base })]) if (p) {
      const oldSlug = `${old}${p.type === 'listicle' ? '-buying-guide' : '-story'}`;
      all.push({ ...p, product_name: f.display, product_title: f.display, search_terms: [f.brand, f.model, f.title].filter(Boolean).join(' '), maker: [f.brand && !/generic|printify/i.test(f.brand) ? f.brand : '', f.model].filter(Boolean), aliases: oldSlug !== p.slug ? [oldSlug, `${old}-${f.id}${p.type === 'listicle' ? '-buying-guide' : '-story'}`] : [] });
    }
  }
  const seen = new Map(); for (const p of all) seen.set(p.seo_title, (seen.get(p.seo_title) || 0) + 1);
  for (const p of all) if (seen.get(p.seo_title) > 1) { const sfx = ` (${p.blueprint_id})`; p.seo_title = p.seo_title.slice(0, 60 - sfx.length) + sfx; }
  const byCat = new Map();
  for (const p of all) { if (!byCat.has(p.category)) byCat.set(p.category, []); byCat.get(p.category).push(p); }
  for (const p of all) {
    const pool = byCat.get(p.category).filter(x => x.type === p.type && x.slug !== p.slug);
    const start = hash(p.slug) % Math.max(1, pool.length);
    p.related = [0, 1, 2, 3].map(i => pool[(start + i * 7) % pool.length]?.slug).filter((s, i, a) => s && a.indexOf(s) === i);
    if (!all.some(x => x.slug === p.sibling)) delete p.sibling;
  }
  return all;
}
