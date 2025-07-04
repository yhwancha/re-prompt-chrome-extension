// Chrome Extension Content Script - Video Scanner
console.log('🎥 Video Scanner Content Script loaded');

interface VideoInfo {
  title: string;
  description: string;
  url: string;
  platform: 'youtube' | 'instagram' | 'unknown';
  thumbnail?: string;
  duration?: string;
  views?: string;
  author?: string;
}

interface ScanResult {
  success: boolean;
  data?: VideoInfo;
  error?: string;
}

// 플랫폼별 셀렉터 정의
const SELECTORS = {
  youtube: {
    title: [
      'h1.ytd-video-primary-info-renderer',
      'h1.style-scope.ytd-video-primary-info-renderer',
      'h1[class*="ytd-video-primary-info-renderer"]',
      '.ytd-video-primary-info-renderer h1',
      'h1'
    ],
    description: [
      '#description-text',
      '#description',
      '.ytd-video-secondary-info-renderer #description',
      '[id="description"]',
      '.description'
    ],
    thumbnail: [
      'video',
      '.ytp-cued-thumbnail-overlay-image',
      '.ytd-player img'
    ],
    duration: [
      '.ytp-time-duration',
      '.ytd-thumbnail-overlay-time-status-renderer'
    ],
    views: [
      '.ytd-video-view-count-renderer',
      '.view-count'
    ],
    author: [
      '.ytd-video-owner-renderer .ytd-channel-name a',
      '.ytd-channel-name a'
    ]
  },
  instagram: {
    title: [
      'h1',
      '[data-testid="post-title"]',
      '.x1i10hfl'
    ],
    description: [
      '[data-testid="post-description"]',
      '[role="button"] span',
      '.x193iq5w'
    ],
    thumbnail: [
      'video',
      'img[style*="object-fit"]'
    ],
    author: [
      '[data-testid="post-username"]',
      'a[role="link"]'
    ]
  }
};

/**
 * 현재 URL을 기반으로 플랫폼을 감지
 */
function detectPlatform(url: string): 'youtube' | 'instagram' | 'unknown' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('instagram.com')) {
    return 'instagram';
  }
  return 'unknown';
}

/**
 * 안전하게 텍스트 추출
 */
function safeExtractText(element: Element | null): string {
  if (!element) return '';
  return element.textContent?.trim() || element.getAttribute('alt') || '';
}

/**
 * 여러 셀렉터로 요소 찾기
 */
function findElementBySelectors(selectors: string[]): Element | null {
  for (const selector of selectors) {
    try {
      const element = document.querySelector(selector);
      if (element && safeExtractText(element)) {
        return element;
      }
    } catch (e) {
      console.warn('Selector failed:', selector, e);
    }
  }
  return null;
}

/**
 * YouTube 비디오 정보 추출
 */
function extractYouTubeInfo(): Partial<VideoInfo> {
  const selectors = SELECTORS.youtube;
  
  return {
    title: safeExtractText(findElementBySelectors(selectors.title)),
    description: safeExtractText(findElementBySelectors(selectors.description)),
    duration: safeExtractText(findElementBySelectors(selectors.duration)),
    views: safeExtractText(findElementBySelectors(selectors.views)),
    author: safeExtractText(findElementBySelectors(selectors.author))
  };
}

/**
 * Instagram 비디오 정보 추출
 */
function extractInstagramInfo(): Partial<VideoInfo> {
  const selectors = SELECTORS.instagram;
  
  return {
    title: safeExtractText(findElementBySelectors(selectors.title)),
    description: safeExtractText(findElementBySelectors(selectors.description)),
    author: safeExtractText(findElementBySelectors(selectors.author))
  };
}

/**
 * 일반적인 비디오 요소 스캔
 */
function scanForVideoElements(): Partial<VideoInfo> {
  // 비디오 태그 찾기
  const videoElements = document.querySelectorAll('video');
  const metaTags = document.querySelectorAll('meta');
  
  let title = document.title;
  let description = '';
  
  // 메타 태그에서 정보 추출
  metaTags.forEach(meta => {
    const property = meta.getAttribute('property') || meta.getAttribute('name');
    const content = meta.getAttribute('content') || '';
    
    if (property === 'og:title' || property === 'twitter:title') {
      title = content || title;
    }
    if (property === 'og:description' || property === 'twitter:description' || property === 'description') {
      description = content || description;
    }
  });
  
  return {
    title,
    description,
    thumbnail: videoElements.length > 0 ? (videoElements[0] as HTMLVideoElement).poster : undefined
  };
}

/**
 * 메인 비디오 스캔 함수
 */
function scanCurrentWindow(): ScanResult {
  try {
    const url = window.location.href;
    const platform = detectPlatform(url);
    
    console.log('🔍 Scanning window for video info:', { url, platform });
    
    let videoInfo: Partial<VideoInfo>;
    
    // 플랫폼별 정보 추출
    switch (platform) {
      case 'youtube':
        videoInfo = extractYouTubeInfo();
        break;
      case 'instagram':
        videoInfo = extractInstagramInfo();
        break;
      default:
        videoInfo = scanForVideoElements();
    }
    
    // 기본 정보 보완
    const result: VideoInfo = {
      title: videoInfo.title || document.title || 'No title found',
      description: videoInfo.description || 'No description found',
      url,
      platform,
      thumbnail: videoInfo.thumbnail,
      duration: videoInfo.duration,
      views: videoInfo.views,
      author: videoInfo.author
    };
    
    // 결과 검증
    if (!result.title || result.title === 'No title found') {
      return {
        success: false,
        error: `No video content found on this ${platform} page`
      };
    }
    
    console.log('✅ Video info extracted:', result);
    
    return {
      success: true,
      data: result
    };
    
  } catch (error) {
    console.error('❌ Error scanning window:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown scanning error'
    };
  }
}

/**
 * 페이지 로드 대기 함수
 */
function waitForPageLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', () => resolve());
    }
  });
}

/**
 * 동적 콘텐츠 로드 대기 (SPA 대응)
 */
function waitForContent(maxWait: number = 5000): Promise<void> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkContent = () => {
      const platform = detectPlatform(window.location.href);
      const hasContent = platform !== 'unknown' && 
        (document.querySelector('h1') || document.querySelector('video'));
      
      if (hasContent || Date.now() - startTime > maxWait) {
        resolve();
      } else {
        setTimeout(checkContent, 100);
      }
    };
    
    checkContent();
  });
}

// Chrome Extension 메시지 리스너
if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    console.log('📨 Received message:', request);
    
    if (request.type === 'EXTRACT_VIDEO_INFO' || request.action === 'extractVideoInfo') {
      // 비동기 처리를 위해 즉시 true 반환
      (async () => {
        try {
          await waitForContent();
          const result = scanCurrentWindow();
          sendResponse(result);
        } catch (error) {
          sendResponse({
            success: false,
            error: 'Failed to scan window: ' + (error instanceof Error ? error.message : 'Unknown error')
          });
        }
      })();
      
      return true; // 비동기 응답을 위해 true 반환
    }
  });
}

// 전역 함수로 export (popup에서 executeScript로 사용 가능)
(window as any).scanCurrentWindow = scanCurrentWindow;
(window as any).extractVideoInfo = scanCurrentWindow; // 하위 호환성

// 초기화
(async () => {
  await waitForPageLoad();
  console.log('🎥 Video Scanner ready on:', window.location.href);
})(); 