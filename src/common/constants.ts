// Supported platforms list
export const SUPPORTED_PLATFORMS = {
  YOUTUBE: 'youtube',
  INSTAGRAM: 'instagram',
} as const;

// Message types
export const MESSAGE_TYPES = {
  EXTRACT_VIDEO_INFO: 'EXTRACT_VIDEO_INFO',
  GENERATE_PROMPT: 'GENERATE_PROMPT',
  UPDATE_POPUP: 'UPDATE_POPUP',
} as const;

// Selector map
export const SELECTORS = {
  youtube: {
    title: 'h1.ytd-video-primary-info-renderer',
    description: '#description-text, #description',
    fallbackTitle: 'h1',
  },
  instagram: {
    title: 'h1',
    description: '[data-testid="post-description"]',
    fallbackTitle: 'title',
  },
} as const;