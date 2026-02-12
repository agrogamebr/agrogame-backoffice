'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ActivityImageUploadProps {
  label: string;
  helperText?: string;
  name: string;
  accept?: string;
}

export function ActivityImageUpload({
  label,
  helperText,
  name,
  accept = 'image/png,image/jpeg',
}: ActivityImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSelectFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('📸 [ActivityImageUpload] No file selected');
      setPreviewUrl(null);
      setFileName(null);
      return;
    }

    console.log('📸 [ActivityImageUpload] File selected:', { 
      name: file.name, 
      size: file.size, 
      type: file.type,
      actualFile: !!file 
    });

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return nextPreviewUrl;
    });
    setFileName(file.name);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
        {previewUrl ? (
          <div className="space-y-3">
            <div className="relative w-full aspect-square max-w-45 mx-auto overflow-hidden rounded-lg bg-white">
              <Image
                src={previewUrl}
                alt="Preview da atividade"
                fill
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
              className="text-sm font-semibold text-[#0B63E5] hover:text-[#0951bd]"
            >
              Selecionar nova imagem
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSelectFile}
            className="w-full text-sm font-semibold text-gray-600 hover:text-[#0B63E5]"
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
          className="hidden"
          aria-label={label}
        />
      </div>
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
