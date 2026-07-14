/**
 * External map link builders (no API keys required).
 * Amap = navigation / place marker
 * Baidu = panorama-oriented place view
 */

export function buildAmapUrl(lat: number, lng: number, name: string): string {
  const n = encodeURIComponent(name);
  return `https://uri.amap.com/marker?position=${lng},${lat}&name=${n}&coordinate=gaode&callnative=1`;
}

export function buildBaiduPanoramaUrl(lat: number, lng: number, name: string): string {
  const n = encodeURIComponent(name);
  // Open Baidu Map at coordinates with place name; users can enter panorama from there.
  // Mobile often offers street/scenic panorama when available.
  return `https://map.baidu.com/search/${n}/@${lng},${lat},19z`;
}

export function hasCoordinates(
  lat?: number | null,
  lng?: number | null,
): lat is number {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  );
}
