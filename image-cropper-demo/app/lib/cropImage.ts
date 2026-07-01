import { LOGO_OUTPUT_SIZE } from "./logoConfig";

function getRadianAngle(degree: number) {
  return (degree * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Export the current crop selection into a square PNG.
 * This is used when you want zoom/pan changes in the editor to affect the saved image.
 */
export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation = 0,
  outputSize = LOGO_OUTPUT_SIZE,
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const { width: boxWidth, height: boxHeight } = rotateSize(
    image.naturalWidth,
    image.naturalHeight,
    rotation,
  );

  canvas.width = boxWidth;
  canvas.height = boxHeight;

  ctx.imageSmoothingEnabled = true;
  // Best effort: some browsers may ignore this.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ctx as any).imageSmoothingQuality = "high";

  ctx.translate(boxWidth / 2, boxHeight / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    throw new Error("Could not get cropped canvas context");
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.fillStyle = "#ffffff";
  croppedCtx.fillRect(0, 0, pixelCrop.width, pixelCrop.height);

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  const outputCanvas = document.createElement("canvas");
  const outputCtx = outputCanvas.getContext("2d");

  if (!outputCtx) {
    throw new Error("Could not get output canvas context");
  }

  outputCanvas.width = outputSize;
  outputCanvas.height = outputSize;

  outputCtx.imageSmoothingEnabled = true;
  // Best effort: some browsers may ignore this.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (outputCtx as any).imageSmoothingQuality = "high";

  outputCtx.fillStyle = "#ffffff";
  outputCtx.fillRect(0, 0, outputSize, outputSize);
  outputCtx.drawImage(croppedCanvas, 0, 0, outputSize, outputSize);

  return outputCanvas.toDataURL("image/png");
}

/**
 * Fits the entire image inside a white square (object-fit: contain).
 * Use this for Providhy logos so horizontal images (e.g. 406×96) are never
 * cropped to a center square — they scale to full width with white padding.
 */
export async function getContainedLogoImage(
  imageSrc: string,
  rotation = 0,
  outputSize = LOGO_OUTPUT_SIZE,
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = outputSize;
  canvas.height = outputSize;

  ctx.imageSmoothingEnabled = true;
  // Best effort: some browsers may ignore this.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ctx as any).imageSmoothingQuality = "high";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, outputSize, outputSize);

  const { width: boundingWidth, height: boundingHeight } = rotateSize(
    image.naturalWidth,
    image.naturalHeight,
    rotation,
  );
  const scale = Math.min(outputSize / boundingWidth, outputSize / boundingHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;

  ctx.translate(outputSize / 2, outputSize / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

  // PNG keeps sharp edges/text better at small sizes (e.g. 96×96 logos).
  return canvas.toDataURL("image/png");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = src;
  });
}
