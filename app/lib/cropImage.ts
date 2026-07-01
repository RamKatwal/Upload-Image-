import { LOGO_OUTPUT_SIZE } from "./logoConfig";

function getRadianAngle(degree: number) {
  return (degree * Math.PI) / 180;
}

type LoadedCanvasSource =
  | { source: HTMLImageElement; width: number; height: number; cleanup?: () => void }
  | { source: ImageBitmap; width: number; height: number; cleanup: () => void };

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
  const { source, width, height, cleanup } = await loadCanvasSource(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  try {
    const { width: boxWidth, height: boxHeight } = rotateSize(width, height, rotation);

    canvas.width = boxWidth;
    canvas.height = boxHeight;

    ctx.imageSmoothingEnabled = true;
    // Best effort: some browsers may ignore this.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ctx as any).imageSmoothingQuality = "high";

    ctx.translate(boxWidth / 2, boxHeight / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-width / 2, -height / 2);
    ctx.drawImage(source, 0, 0, width, height);

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
  } finally {
    cleanup?.();
  }
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
  const { source, width, height, cleanup } = await loadCanvasSource(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  try {
    canvas.width = outputSize;
    canvas.height = outputSize;

    ctx.imageSmoothingEnabled = true;
    // Best effort: some browsers may ignore this.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ctx as any).imageSmoothingQuality = "high";

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outputSize, outputSize);

    const { width: boundingWidth, height: boundingHeight } = rotateSize(width, height, rotation);
    const scale = Math.min(outputSize / boundingWidth, outputSize / boundingHeight);
    const drawWidth = width * scale;
    const drawHeight = height * scale;

    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.drawImage(source, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

    // PNG keeps sharp edges/text better at small sizes (e.g. 96×96 logos).
    return canvas.toDataURL("image/png");
  } finally {
    cleanup?.();
  }
}

async function loadCanvasSource(src: string): Promise<LoadedCanvasSource> {
  // Prefer ImageBitmap with EXIF orientation applied (fixes iOS/Android rotated uploads
  // when exporting through canvas). Falls back to <img> when unavailable.
  try {
    const res = await fetch(src);
    const blob = await res.blob();

    if (typeof createImageBitmap === "function") {
      try {
        const bitmap = await createImageBitmap(blob, {
          // @ts-expect-error: imageOrientation is still not in some TS DOM libs
          imageOrientation: "from-image",
        });
        return {
          source: bitmap,
          width: bitmap.width,
          height: bitmap.height,
          cleanup: () => bitmap.close(),
        };
      } catch {
        // Fall through to <img>
      }
    }
  } catch {
    // Fall back to <img> loader below
  }

  const image = await loadImage(src);
  return { source: image, width: image.naturalWidth, height: image.naturalHeight };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = src;
  });
}
