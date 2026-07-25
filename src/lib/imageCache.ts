const cache = new Map<string, HTMLImageElement>();

export function loadImage(src: string): HTMLImageElement {
  const existing = cache.get(src);
  if (existing) return existing;

  const img = new Image();
  img.src = src;
  cache.set(src, img);
  return img;
}

export function isImageReady(img: HTMLImageElement): boolean {
  return img.complete && img.naturalWidth > 0;
}
