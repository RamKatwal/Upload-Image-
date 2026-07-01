"use client";

import { useCallback, useRef, useState } from "react";
import Cropper, { type MediaSize } from "react-easy-crop";
import { getContainedLogoImage, getCroppedImage, type PixelCrop } from "../lib/cropImage";
import {
  getFitZoomInCropArea,
  getInitialLogoCropZoom,
  getMinLogoCropZoom,
  type LogoMediaSize,
} from "../lib/cropFit";
import { IconClose, IconRotateCcw, IconRotateCw, IconZoomIn, IconZoomOut } from "./icons";

type EditImageModalProps = {
  imageSrc: string;
  onClose: () => void;
  onConfirm: (croppedImage: string) => void;
};

function CropSlider({
  value,
  min,
  max,
  step,
  onChange,
  leftIcon,
  rightIcon,
  onLeftClick,
  onRightClick,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  onLeftClick: () => void;
  onRightClick: () => void;
}) {
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onLeftClick}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-text-muted transition-colors hover:bg-gray-100"
        aria-label="Decrease"
      >
        {leftIcon}
      </button>

      <div className="relative flex-1">
        <div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-gray-200" />
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-providhy-teal"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="crop-slider relative z-10 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>

      <button
        type="button"
        onClick={onRightClick}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-text-muted transition-colors hover:bg-gray-100"
        aria-label="Increase"
      >
        {rightIcon}
      </button>
    </div>
  );
}

export function EditImageModal({ imageSrc, onClose, onConfirm }: EditImageModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(0.1);
  const [maxZoom, setMaxZoom] = useState(3);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCropperReady, setIsCropperReady] = useState(false);

  const mediaSizeRef = useRef<LogoMediaSize | null>(null);
  const cropSizeRef = useRef<{ width: number; height: number } | null>(null);
  const didInitRef = useRef(false);
  const initialZoomRef = useRef<number | null>(null);
  const initialCropRef = useRef<{ x: number; y: number } | null>(null);

  const applyFitZoom = useCallback(() => {
    const mediaSize = mediaSizeRef.current;
    const cropSize = cropSizeRef.current;

    if (!mediaSize || !cropSize) return;

    const fitZoom = getFitZoomInCropArea(mediaSize, cropSize);
    const initialZoom = getInitialLogoCropZoom(mediaSize, cropSize);

    setMinZoom(getMinLogoCropZoom(fitZoom));
    setMaxZoom(Math.max(3, fitZoom * 4));
    setZoom(initialZoom);
    setCrop({ x: 0, y: 0 });
    initialZoomRef.current = initialZoom;
    initialCropRef.current = { x: 0, y: 0 };
    setIsCropperReady(true);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    setIsSaving(true);
    try {
      const initialZoom = initialZoomRef.current;
      const initialCrop = initialCropRef.current;

      const isDefaultFit =
        initialZoom !== null &&
        initialCrop !== null &&
        Math.abs(zoom - initialZoom) < 0.02 &&
        Math.abs(crop.x - initialCrop.x) < 0.5 &&
        Math.abs(crop.y - initialCrop.y) < 0.5 &&
        Math.abs(rotation) < 0.5;

      const croppedImage = isDefaultFit
        ? await getContainedLogoImage(imageSrc, rotation)
        : await getCroppedImage(imageSrc, croppedAreaPixels, rotation);
      onConfirm(croppedImage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaLoaded = useCallback(
    (mediaSize: MediaSize) => {
      mediaSizeRef.current = mediaSize;
      if (!didInitRef.current && cropSizeRef.current) {
        applyFitZoom();
        didInitRef.current = true;
      }
    },
    [applyFitZoom],
  );

  const handleCropSizeChange = useCallback(
    (cropSize: { width: number; height: number }) => {
      cropSizeRef.current = cropSize;
      if (!didInitRef.current && mediaSizeRef.current) {
        applyFitZoom();
        didInitRef.current = true;
      }
    },
    [applyFitZoom],
  );

  const handleCropComplete = useCallback((_area: unknown, areaPixels: PixelCrop) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close modal overlay"
      />

      <div className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Edit image</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-text-muted transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-square w-full bg-[#3d3d3d]">
          <Cropper
            key={imageSrc}
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            objectFit="contain"
            restrictPosition
            minZoom={minZoom}
            maxZoom={maxZoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={handleCropComplete}
            onMediaLoaded={handleMediaLoaded}
            onCropSizeChange={handleCropSizeChange}
            showGrid={false}
            style={{
              cropAreaStyle: {
                border: "2px solid #3b6fd9",
                background: "transparent",
                color: "rgba(0, 0, 0, 0.55)",
                boxShadow: "0 0 0 9999em",
              },
            }}
          />
        </div>

        <div className="space-y-4 border-b border-border px-6 py-5">
          <CropSlider
            value={zoom}
            min={minZoom}
            max={maxZoom}
            step={0.01}
            onChange={setZoom}
            leftIcon={<IconZoomOut className="h-4 w-4" />}
            rightIcon={<IconZoomIn className="h-4 w-4" />}
            onLeftClick={() => setZoom((z) => Math.max(minZoom, z - 0.1))}
            onRightClick={() => setZoom((z) => Math.min(maxZoom, z + 0.1))}
          />
          <CropSlider
            value={rotation}
            min={-180}
            max={180}
            step={1}
            onChange={setRotation}
            leftIcon={<IconRotateCcw className="h-4 w-4" />}
            rightIcon={<IconRotateCw className="h-4 w-4" />}
            onLeftClick={() => setRotation((r) => Math.max(-180, r - 15))}
            onRightClick={() => setRotation((r) => Math.min(180, r + 15))}
          />
        </div>

        <div className="flex justify-end gap-3 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-white px-5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSaving || !isCropperReady || !croppedAreaPixels}
            className="rounded-md bg-providhy-teal px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-providhy-teal-dark disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
