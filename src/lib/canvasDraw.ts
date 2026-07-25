export function drawContainFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
  const drawW = img.naturalWidth * scale;
  const drawH = img.naturalHeight * scale;
  ctx.drawImage(
    img,
    x + (width - drawW) / 2,
    y + (height - drawH) / 2,
    drawW,
    drawH
  );
}

/**
 * Always fills the given width (scaling from the image's natural width) and
 * clips whatever doesn't fit vertically, instead of shrinking the whole
 * image down to fit — avoids a tiny floating sliver when width is narrow.
 */
export function drawWidthFitClipped(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const scale = width / img.naturalWidth;
  const drawH = img.naturalHeight * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.drawImage(img, x, y + (height - drawH) / 2, width, drawH);
  ctx.restore();
}
