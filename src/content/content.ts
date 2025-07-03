import { detectPlatform, safeExtractText, validateVideoInfo, logError } from '../common/utils';
import { SELECTORS, MESSAGE_TYPES } from '../common/constants';
import type { VideoInfo, ExtractResult, ChromeMessage } from '../types/chrome';

/**
 * Main function to extract video information
 */
function extractVideoInfo(): ExtractResult {
  try {
    const url = window.location.href;
    const platform = detectPlatform(url);
    
    if (!platform) {
      return {
        success: false,
        error: 'Unsupported platform',
      };
    }

    const selectors = SELECTORS[platform];
    let title = '';
    let description = '';

    // Extract title
    title = safeExtractText(document.querySelector(selectors.title));
    if (!title) {
      title = safeExtractText(document.querySelector(selectors.fallbackTitle));
    }

    // Extract description
    description = safeExtractText(document.querySelector(selectors.description));

    const videoInfo: VideoInfo = {
      title: title || 'No title found',
      description: description || 'No description found',
      url,
      platform,
    };

    const validatedInfo = validateVideoInfo(videoInfo);
    if (!validatedInfo) {
      return {
        success: false,
        error: 'Failed to validate video info',
      };
    }

    return {
      success: true,
      data: validatedInfo,
    };
  } catch (error) {
    logError('Content Script', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Set up message listener
 */
chrome.runtime.onMessage.addListener((message: ChromeMessage, _sender: chrome.runtime.MessageSender, sendResponse: (response: ExtractResult) => void) => {
  if (message.type === MESSAGE_TYPES.EXTRACT_VIDEO_INFO) {
    const result = extractVideoInfo();
    sendResponse(result);
  }
});

// Export as global function (used by popup with executeScript)
(window as any).extractVideoInfo = extractVideoInfo;

console.log('RePrompt content script loaded'); 