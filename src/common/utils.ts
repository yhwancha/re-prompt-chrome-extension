import { SUPPORTED_PLATFORMS } from './constants';
import type { VideoInfo } from '../types/chrome';

/**
 * Detect platform based on current URL.
 */
export function detectPlatform(url: string): 'youtube' | 'instagram' | null {
  if (url.includes('youtube.com')) {
    return SUPPORTED_PLATFORMS.YOUTUBE as 'youtube';
  }
  if (url.includes('instagram.com')) {
    return SUPPORTED_PLATFORMS.INSTAGRAM as 'instagram';
  }
  return null;
}

/**
 * Safely extract text.
 */
export function safeExtractText(element: Element | null): string {
  if (!element) return '';
  return element.textContent?.trim() || '';
}

/**
 * Validate video information.
 */
export function validateVideoInfo(info: Partial<VideoInfo>): VideoInfo | null {
  if (!info.title || !info.url) return null;
  
  return {
    title: info.title,
    description: info.description || '',
    url: info.url,
    platform: info.platform || 'youtube',
  };
}

/**
 * Log errors.
 */
export function logError(context: string, error: unknown): void {
  console.error(`[RePrompt ${context}]`, error);
} 