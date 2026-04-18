'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ActivityImageUploadProps {
  label: string;
  helperText?: string;
  name: string;
  accept?: string;
  initialImageGsUri?: string;
  disabled?: boolean;
}

export function ActivityImageUpload({
  label,
  helperText,
  name,
  accept = 'image/png,image/jpeg',
  initialImageGsUri,
  disabled = false,
}: ActivityImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Build proxy URL if initialImageGsUri is provided
  const initialPreviewUrl = initialImageGsUri
    ? `/api/files/proxy?url=${encodeURIComponent(initialImageGsUri)}`
    : null;

  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl);
  const [fileName, setFileName] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Only revoke blob URLs, not external URLs
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleSelectFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      setBlobUrl(null);
      setFileName(null);
      return;
    }

    const nextBlobUrl = URL.createObjectURL(file);

    // Revoke previous blob URL if it exists
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }

    setPreviewUrl(nextBlobUrl);
    setBlobUrl(nextBlobUrl);
    setFileName(file.name);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className={`border border-dashed border-gray-300 rounded-lg p-4 text-center ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'}`}>
        {previewUrl ? (
          <div className="space-y-3">
            <div className="relative w-full aspect-square max-w-45 mx-auto overflow-hidden rounded-lg bg-white">
              <Image
                src={previewUrl}
                alt="Preview da ação"
                fill
                unoptimized={previewUrl.startsWith('/api/')}
                className="object-cover"
              />
            </div>
            {fileName && (
              <p className="text-xs text-gray-500">
                {fileName}
              </p>
            )}
            <button
              type="button"
              onClick={handleSelectFile}
              disabled={disabled}
              className="text-sm font-semibold text-[#0B63E5] hover:text-[#0951bd] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selecionar nova imagem
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSelectFile}
            disabled={disabled}
            className="w-full text-sm font-semibold text-gray-600 hover:text-[#0B63E5] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload da imagem
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          aria-label={label}
        />
      </div>
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
