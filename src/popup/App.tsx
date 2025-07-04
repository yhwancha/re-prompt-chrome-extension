import { useState, useEffect } from 'react';
import './style.css';
import { logError } from '../common/utils';

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

function App() {
    const [currentURL, setCurrentURL] = useState<string>('');
    const [isSupported, setIsSupported] = useState<boolean>(false);
    const [showInsertUrl, setShowInsertUrl] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [parseResult, setParseResult] = useState<VideoInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkCurrentTab();
        console.log(currentURL, isSupported);
    }, []);

    const checkCurrentTab = async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab.url) {
                setCurrentURL(tab.url);
                console.log(tab.url);
                const supported = tab.url.includes('youtube.com') || tab.url.includes('instagram.com');
                setIsSupported(supported);
            }
        } catch (err) {
            logError('Tab Check', err);
        }
    };

    const parserThisPage = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setParseResult(null);
            
            console.log('🚀 Starting page parsing...');
            
            // 현재 활성 탭 가져오기
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.id) {
                throw new Error('No active tab found');
            }
            
            if (!tab.url) {
                throw new Error('No URL found in current tab');
            }
            
            console.log('📄 Current tab:', { id: tab.id, url: tab.url });
            
            // Content script에 메시지 전송
            const result = await sendMessageToTab(tab.id, { type: 'EXTRACT_VIDEO_INFO' });
            
            if (result.success && result.data) {
                console.log('✅ Parse successful:', result.data);
                setParseResult(result.data);
            } else {
                console.error('❌ Parse failed:', result.error);
                setError(result.error || 'Failed to parse page');
            }
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            console.error('❌ Parser error:', errorMessage);
            logError('Parser', err);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessageToTab = async (tabId: number, message: any): Promise<ScanResult> => {
        return new Promise((resolve) => {
            console.log('📨 Sending message to tab:', tabId, message);
            
            chrome.tabs.sendMessage(tabId, message, (response: ScanResult) => {
                if (chrome.runtime.lastError) {
                    console.warn('⚠️ Content script not found, injecting...');
                    
                    // Content script가 없는 경우 주입
                    chrome.scripting.executeScript({
                        target: { tabId },
                        files: ['content.js'],
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.error('❌ Failed to inject content script:', chrome.runtime.lastError);
                            resolve({
                                success: false,
                                error: 'Failed to inject content script: ' + chrome.runtime.lastError.message,
                            });
                            return;
                        }
                        
                        console.log('✅ Content script injected, retrying...');
                        
                        // 주입 후 잠시 대기하고 재시도
                        setTimeout(() => {
                            chrome.tabs.sendMessage(tabId, message, (retryResponse: ScanResult) => {
                                if (chrome.runtime.lastError) {
                                    resolve({
                                        success: false,
                                        error: 'Content script injection failed: ' + chrome.runtime.lastError.message,
                                    });
                                } else {
                                    console.log('✅ Retry successful:', retryResponse);
                                    resolve(retryResponse || {
                                        success: false,
                                        error: 'No response from content script',
                                    });
                                }
                            });
                        }, 500); // 500ms 대기
                    });
                } else {
                    console.log('✅ Direct response:', response);
                    resolve(response || {
                        success: false,
                        error: 'No response from content script',
                    });
                }
            });
        });
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('📋 Copied to clipboard:', text.substring(0, 50) + '...');
        } catch (err) {
            console.error('❌ Copy failed:', err);
        }
    };

    const clearResults = () => {
        setParseResult(null);
        setError(null);
    };

    return (
        <>
            <div className="container">
                <div className="header">
                    <div className="logo"></div>
                    <h1 className="title">RePrompt</h1>
                    
                    <div className="actions">
                        <button 
                            onClick={parserThisPage}
                            disabled={isLoading}
                            className={`parse-button ${isLoading ? 'loading' : ''}`}
                        >
                            {isLoading ? '🔄 Parsing...' : '🔍 Parse This Page'}
                        </button>
                        
                        <button 
                            onClick={() => setShowInsertUrl(true)}
                            className="secondary-button"
                        >
                            📝 Manual URL
                        </button>
                        
                        {(parseResult || error) && (
                            <button 
                                onClick={clearResults}
                                className="clear-button"
                            >
                                🗑️ Clear
                            </button>
                        )}
                    </div>
                    
                    {showInsertUrl && (
                        <div className="insert-url-container">
                            <input type="text" placeholder="Enter URL" />
                            <button onClick={() => setShowInsertUrl(false)}>Cancel</button>
                            <button onClick={() => setShowInsertUrl(false)}>Submit</button>
                        </div>
                    )}
                </div>

                {/* Current Page Info */}
                <div className="current-page">
                    <p className="current-url">📄 {currentURL}</p>
                    <span className={`status ${isSupported ? 'supported' : 'unsupported'}`}>
                        {isSupported ? '✅ Supported' : '⚠️ Unsupported'}
                    </span>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Scanning page for video content...</p>
                    </div>
                )}

                {/* Parse Results */}
                {parseResult && (
                    <div className="result-container">
                        <h3>🎥 Video Information</h3>
                        
                        <div className="result-field">
                            <label>Title:</label>
                            <p onClick={() => copyToClipboard(parseResult.title)}>
                                {parseResult.title}
                            </p>
                        </div>
                        
                        {parseResult.description && (
                            <div className="result-field">
                                <label>Description:</label>
                                <p onClick={() => copyToClipboard(parseResult.description)}>
                                    {parseResult.description.substring(0, 200)}
                                    {parseResult.description.length > 200 ? '...' : ''}
                                </p>
                            </div>
                        )}
                        
                        <div className="result-field">
                            <label>Platform:</label>
                            <span className={`platform-badge ${parseResult.platform}`}>
                                {parseResult.platform.toUpperCase()}
                            </span>
                        </div>
                        
                        {parseResult.author && (
                            <div className="result-field">
                                <label>Author:</label>
                                <p>{parseResult.author}</p>
                            </div>
                        )}
                        
                        {parseResult.duration && (
                            <div className="result-field">
                                <label>Duration:</label>
                                <p>{parseResult.duration}</p>
                            </div>
                        )}
                        
                        {parseResult.views && (
                            <div className="result-field">
                                <label>Views:</label>
                                <p>{parseResult.views}</p>
                            </div>
                        )}
                        
                        <div className="result-actions">
                            <button onClick={() => copyToClipboard(JSON.stringify(parseResult, null, 2))}>
                                📋 Copy All Data
                            </button>
                            <button onClick={() => copyToClipboard(parseResult.url)}>
                                🔗 Copy URL
                            </button>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="error-container">
                        <h3>❌ Error</h3>
                        <p>{error}</p>
                        {!isSupported && (
                            <p className="hint">
                                💡 Try navigating to a YouTube or Instagram video page
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    )
};

export default App;