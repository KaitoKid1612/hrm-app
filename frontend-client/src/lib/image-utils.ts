import { APP_CONFIG } from '@/constants';

/**
 * Get the full URL for an image
 * Handles both local uploads and external URLs (like Cloudinary)
 */
export function getImageUrl(imagePath: string | null | undefined): string | undefined {
  if (!imagePath) return undefined;

  // If it's already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it starts with /uploads/, it's a local upload
  // Need to use the base URL without /api suffix
  if (imagePath.startsWith('/uploads/')) {
    const baseUrl = APP_CONFIG.API_BASE_URL.replace('/api', '');
    return `${baseUrl}${imagePath}`;
  }

  // For other paths, return as is (shouldn't happen normally)
  return imagePath;
}
