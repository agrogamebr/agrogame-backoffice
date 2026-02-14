'use client';

import { FileText } from 'lucide-react';
import { SubmissionFile } from '@/services/activity-submissions.service';
import { getFileUrl, isImageFile, getFileExtension } from '@/lib/file-utils';

interface FilePreviewProps {
  file: SubmissionFile;
  className?: string;
}

export const FilePreview = ({ file, className = '' }: FilePreviewProps) => {
  const isImage = isImageFile(file.fileName);
  const fileUrl = getFileUrl(file.gsutilUri);

  if (isImage) {
    return (
      <img
        src={fileUrl}
        alt={file.fileName}
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          target.onerror = null;
          target.style.display = 'none';
          target.parentElement?.classList.add('bg-gray-100', 'flex', 'items-center', 'justify-center');
          if (target.parentElement) {
            target.parentElement.innerHTML = '<span class="text-xs text-red-400">Erro</span>';
          }
        }}
      />
    );
  }

  const extension = getFileExtension(file.fileName);

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gray-50 ${className}`}>
      <FileText className="w-8 h-8 text-gray-400 mb-1" />
      <span className="text-xs font-medium text-gray-500">{extension}</span>
    </div>
  );
};
