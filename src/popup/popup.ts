import { MESSAGE_TYPES } from '../common/constants';
import { logError } from '../common/utils';
import type { ExtractResult, ChromeMessage } from '../types/chrome';

class PopupManager {
  private generateBtn: HTMLButtonElement;
  private outputDiv: HTMLDivElement;
  private loadingDiv: HTMLDivElement;

  constructor() {
    this.generateBtn = document.getElementById('generate') as HTMLButtonElement;
    this.outputDiv = document.getElementById('output') as HTMLDivElement;
    this.loadingDiv = document.getElementById('loading') as HTMLDivElement;
    
    this.init();
  }

  private init(): void {
    this.generateBtn.addEventListener('click', this.handleGenerate.bind(this));
    console.log('RePrompt popup initialized');
  }

  private async handleGenerate(): Promise<void> {
    try {
      this.setLoading(true);
      
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) {
        throw new Error('No active tab found');
      }

      // Content script에 메시지 전송
      const result = await this.sendMessageToTab(tab.id, {
        type: MESSAGE_TYPES.EXTRACT_VIDEO_INFO,
      });

      if (result.success && result.data) {
        this.displayResult(result.data);
      } else {
        this.displayError(result.error || 'Failed to extract video info');
      }
    } catch (error) {
      logError('Popup', error);
      this.displayError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.setLoading(false);
    }
  }

  private async sendMessageToTab(tabId: number, message: ChromeMessage): Promise<ExtractResult> {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, message, (response: ExtractResult) => {
        if (chrome.runtime.lastError) {
          // Content script가 없는 경우 executeScript 사용
          chrome.scripting.executeScript({
            target: { tabId },
            files: ['content.js'],
          }, () => {
            if (chrome.runtime.lastError) {
              resolve({
                success: false,
                error: 'Failed to inject content script',
              });
              return;
            }
            
            // 재시도
            chrome.tabs.sendMessage(tabId, message, (retryResponse: ExtractResult) => {
              resolve(retryResponse || {
                success: false,
                error: 'No response from content script',
              });
            });
          });
        } else {
          resolve(response || {
            success: false,
            error: 'No response from content script',
          });
        }
      });
    });
  }

  private setLoading(isLoading: boolean): void {
    this.generateBtn.disabled = isLoading;
    this.loadingDiv.style.display = isLoading ? 'flex' : 'none';
    this.outputDiv.style.display = isLoading ? 'none' : 'block';
  }

  private displayResult(data: any): void {
    this.outputDiv.innerHTML = `
      <div style="margin-bottom: 12px;">
        <strong>✅ Video Info Extracted</strong>
      </div>
      <div style="margin-bottom: 8px;">
        <strong>Title:</strong><br>
        <span style="color: #333;">${this.escapeHtml(data.title)}</span>
      </div>
      <div style="margin-bottom: 8px;">
        <strong>Description:</strong><br>
        <span style="color: #666;">${this.escapeHtml(data.description.slice(0, 200))}${data.description.length > 200 ? '...' : ''}</span>
      </div>
      <div style="margin-bottom: 8px;">
        <strong>Platform:</strong> <span style="color: #667eea;">${data.platform}</span>
      </div>
      <div style="font-size: 11px; color: #999; margin-top: 8px;">
        Ready to generate AI prompt! 🚀
      </div>
    `;
    this.outputDiv.style.display = 'block';
  }

  private displayError(error: string): void {
    this.outputDiv.innerHTML = `
      <div style="color: #dc3545; margin-bottom: 8px;">
        <strong>❌ Error</strong>
      </div>
      <div style="color: #666; font-size: 12px;">
        ${this.escapeHtml(error)}
      </div>
    `;
    this.outputDiv.style.display = 'block';
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// DOM이 로드되면 PopupManager 초기화
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});