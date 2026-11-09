export interface Artwork {
  slug: string;
  title: string;
  year: string;
  width: number;
  height: number;
  artstationId: string;
}

/**
 * A curated selection from artstation.com/tangedy.
 * Images live in /public/art as `<slug>-<width>.webp` at 400/800/1200 (grid) and 1600 (preview).
 * The gallery's layout and order come from `galleryRows` below.
 */
export const artworks: Artwork[] = [
  { slug: 'scroll', title: 'Scroll', year: '2025', width: 1600, height: 881, artstationId: 'YG42qP' },
  { slug: 'symphony', title: 'Symphony', year: '2024', width: 1600, height: 1058, artstationId: '39RXaA' },
  { slug: 'morning-in-kensington', title: 'A Morning in Kensington', year: '2024', width: 1600, height: 1263, artstationId: '29Podg' },
  { slug: 'marcus-aurelius', title: 'Marcus Aurelius', year: '2024', width: 1271, height: 1600, artstationId: 'LRDz8K' },
  { slug: 'summer-2023', title: 'Portfolio Piece, Summer 2023', year: '2023', width: 1183, height: 1600, artstationId: 'rJb1nm' },
  { slug: 'vagabond-musashi', title: 'Vagabond Musashi', year: '2023', width: 1210, height: 1600, artstationId: 'Ny5R9b' },
  { slug: 'portrait-study', title: '汤几一 Portrait Study', year: '2023', width: 1600, height: 1360, artstationId: 'GeXnOV' },
  { slug: '17th', title: '17th', year: '2023', width: 953, height: 1487, artstationId: 'DvmDm9' },
  { slug: 'life-drawing-workshop', title: 'Life Drawing Workshop Portrait', year: '2025', width: 1203, height: 1600, artstationId: 'oJyebq' },
  { slug: '12-15-22', title: '12.15.22', year: '2022', width: 1080, height: 1442, artstationId: 'xDJkL1' },
  { slug: 'gaze', title: 'Gaze', year: '2025', width: 1193, height: 1600, artstationId: 'YG4yB6' },
  { slug: 'bridge-sketch', title: '桥 Sketch', year: '2023', width: 1205, height: 1600, artstationId: 'EvVn3N' },
  { slug: '2-18-23', title: '2.18.23', year: '2023', width: 1200, height: 1600, artstationId: 'WBKw53' },
  { slug: 'sit', title: 'Sit', year: '2025', width: 1194, height: 1600, artstationId: 'Jr3qen' },
  { slug: 'zhuo', title: 'Zhuo', year: '2023', width: 1261, height: 1600, artstationId: 'BXm0g6' },
  { slug: '2-24-23', title: '2.24.23 男', year: '2023', width: 1352, height: 1600, artstationId: '04XKyY' },
  { slug: '3-05-23', title: '3.05.23', year: '2023', width: 1235, height: 1600, artstationId: '298DXa' },
];

/**
 * Gallery layout. Each row fills the full width and every piece in it shares one height,
 * so a piece's size comes from how many pieces share its row:
 *   - large:  Scroll, Portfolio Piece (Summer 2023), 17th
 *   - medium: Kensington, Symphony, Life Drawing Portrait, Portrait Study, Marcus Aurelius, Vagabond Musashi
 *   - small:  everything else
 * Fewer pieces in a row = taller row = bigger pieces. A pair like ['a', 'b'] stacks two
 * pieces in one column, which lets a row of tall portraits grow without leaving empty space.
 */
export type GalleryUnit = string | [string, string];

export const galleryRows: GalleryUnit[][] = [
  ['summer-2023', '17th', ['12-15-22', 'gaze']],
  ['scroll'],
  ['bridge-sketch', '2-18-23', 'sit', 'zhuo'],
  ['symphony', 'morning-in-kensington'],
  ['life-drawing-workshop', 'marcus-aurelius', 'vagabond-musashi'],
  ['portrait-study', '2-24-23', '3-05-23'],
];

/**
 * The same pieces arranged for phones: at most two side by side, so nothing shrinks to a
 * thumbnail. Large pieces still get a row of their own, and every artwork appears once.
 */
export const mobileGalleryRows: GalleryUnit[][] = [
  ['summer-2023', '17th'],
  ['scroll'],
  ['12-15-22', 'gaze'],
  ['symphony'],
  ['life-drawing-workshop', 'marcus-aurelius'],
  ['morning-in-kensington'],
  ['bridge-sketch', '2-18-23'],
  ['vagabond-musashi', ['sit', 'zhuo']],
  ['portrait-study'],
  ['2-24-23', '3-05-23'],
];

export const artImage = (artwork: Artwork, size: 400 | 800 | 1200 | 1600) => `/art/${artwork.slug}-${size}.webp`;

export const artstationUrl = (artwork: Artwork) => `https://www.artstation.com/artwork/${artwork.artstationId}`;
