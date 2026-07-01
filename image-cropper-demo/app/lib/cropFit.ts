type Size = {
  width: number;
  height: number;
};

export type LogoMediaSize = Size & {
  naturalWidth: number;
  naturalHeight: number;
};

/**
 * Zoom level at which the full image fits inside the crop area (contain in square).
 * For wide logos (e.g. 406×96) this is < 1, which is required for 1:1 output slots.
 */
export function getFitZoomInCropArea(mediaSize: Size, cropSize: Size): number {
  if (mediaSize.width === 0 || mediaSize.height === 0) {
    return 1;
  }

  return Math.min(cropSize.width / mediaSize.width, cropSize.height / mediaSize.height);
}

export function getInitialLogoCropZoom(mediaSize: LogoMediaSize, cropSize: Size): number {
  const fitZoom = getFitZoomInCropArea(mediaSize, cropSize);
  return fitZoom * 0.96;
}

export function getMinLogoCropZoom(fitZoom: number): number {
  return Math.max(0.1, fitZoom * 0.75);
}
