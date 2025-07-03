// Chrome Extension API type definitions
export interface VideoInfo {
  title: string;
  description: string;
  url: string;
  platform: 'youtube' | 'instagram';
}

export interface ExtractResult {
  success: boolean;
  data?: VideoInfo;
  error?: string;
}

export interface ChromeMessage {
  type: string;
  payload?: any;
}

// Chrome APIs extension
declare global {
  interface Window {
    chrome: typeof chrome;
  }
} 