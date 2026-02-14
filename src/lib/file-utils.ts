export function isImageFile(fileName: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return imageExtensions.includes(extension);
}

export function getFileExtension(fileName: string): string {
  const extension = fileName.substring(fileName.lastIndexOf('.') + 1).toUpperCase();
  return extension || 'FILE';
}

export function getFileUrl(gsutilUri: string): string {
  if (!gsutilUri) return '';
  return `/api/files/proxy?url=${encodeURIComponent(gsutilUri)}`;
}
