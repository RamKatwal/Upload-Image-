"use client";

import { useRef, useState } from "react";
import { EditImageModal } from "./EditImageModal";
import { IconImage, IconMapPin } from "./icons";

const companyDetails = [
  { label: "Contact", value: "9861158315" },
  { label: "Email", value: "random@gmail.com" },
  { label: "Address", value: "Suryabinayak" },
  { label: "Industry Type", value: "Automobiles" },
  { label: "PAN", value: "" },
  { label: "Number of Employees", value: "1" },
  { label: "Registered with VAT", value: "No" },
];

export function CompanyProfileSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [editorImageSrc, setEditorImageSrc] = useState<string | null>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setEditorImageSrc(objectUrl);
    event.target.value = "";
  };

  const closeEditor = () => {
    if (editorImageSrc) {
      URL.revokeObjectURL(editorImageSrc);
    }
    setEditorImageSrc(null);
  };

  const handleConfirmCrop = (croppedImage: string) => {
    setLogoUrl(croppedImage);
    closeEditor();
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[820px] rounded-lg border border-border bg-white px-8 py-8 shadow-sm">
        <div className="flex gap-10">
          <button
            type="button"
            onClick={openFilePicker}
            className={`group relative flex h-[220px] w-[220px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-border transition-colors hover:border-providhy-teal-muted ${
              logoUrl ? "bg-white" : "bg-[#fafafa] hover:bg-gray-50"
            }`}
            aria-label="Upload company logo"
          >
            {logoUrl ? (
              <div className="flex h-full w-full items-center justify-center bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="Company logo"
                  className="block h-full w-full object-contain"
                />
              </div>
            ) : (
              <IconImage className="h-14 w-14 text-gray-300 transition-colors group-hover:text-gray-400" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="min-w-0 flex-1 pt-1">
            <h2 className="text-xl font-semibold text-gray-800">Alex alex Shop</h2>

            <div className="mt-2 flex items-center gap-1.5 text-sm text-providhy-teal">
              <IconMapPin className="h-4 w-4 shrink-0" />
              <span>Bhaktapur</span>
            </div>

            <a
              href="https://ramkatwal.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-providhy-teal hover:underline"
            >
              ramkatwal.com.np
            </a>

            <dl className="mt-6 space-y-3">
              {companyDetails.map(({ label, value }) => (
                <div key={label} className="grid grid-cols-[160px_1fr] gap-4 text-sm">
                  <dt className="text-text-label">{label}</dt>
                  <dd className="text-gray-700">{value || "\u00A0"}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {editorImageSrc && (
        <EditImageModal
          imageSrc={editorImageSrc}
          onClose={closeEditor}
          onConfirm={handleConfirmCrop}
        />
      )}
    </>
  );
}
