// Background Script (Service Worker)
// Script that runs in the background of Chrome Extension

import { MESSAGE_TYPES } from '../common/constants';
import { logError } from '../common/utils';
import type { ChromeMessage } from '../types/chrome';

/**
 * Event handler that runs when the Extension is installed
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log('RePrompt Extension installed');
  
  // Add context menu (optional)
  chrome.contextMenus.create({
    id: 'reprompt-extract',
    title: 'Extract with RePrompt',
    contexts: ['page'],
    documentUrlPatterns: ['*://*.youtube.com/*', '*://*.instagram.com/*'],
  });
});

/**
 * Context menu click event handler
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'reprompt-extract' && tab?.id) {
    // Send message to content script instead of popup
    chrome.tabs.sendMessage(tab.id, {
      type: MESSAGE_TYPES.EXTRACT_VIDEO_INFO,
    });
  }
});

/**
 * Message handling (Extension internal communication)
 */
chrome.runtime.onMessage.addListener((message: ChromeMessage, _sender, sendResponse) => {
  try {
    switch (message.type) {
      case MESSAGE_TYPES.GENERATE_PROMPT:
        // TODO: Implement AI prompt generation logic
        console.log('Generate prompt request:', message.payload);
        sendResponse({ success: true, message: 'Prompt generation requested' });
        break;
      
      default:
        console.log('Unknown message type:', message.type);
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  } catch (error) {
    logError('Background Script', error);
    sendResponse({ success: false, error: 'Background script error' });
  }
});

/**
 * Tab update event handler
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // When page is fully loaded
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if it's a supported platform
    const isSupportedPlatform = 
      tab.url.includes('youtube.com') || 
      tab.url.includes('instagram.com');
    
    if (isSupportedPlatform) {
      // Activate icon (optional)
      chrome.action.setIcon({
        tabId: tabId,
        path: {
          16: 'icons/icon.png',
          48: 'icons/icon.png',
          128: 'icons/icon.png',
        },
      });
    }
  }
});

console.log('RePrompt background script loaded'); 