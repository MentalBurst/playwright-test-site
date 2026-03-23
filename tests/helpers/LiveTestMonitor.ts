import { Page } from '@playwright/test';

export class LiveTestMonitor {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Initialize live test monitoring overlay
   */
  async initialize(testName: string) {
    await this.page.evaluate((testName) => {
      // Create main container
      const container = document.createElement('div');
      container.id = 'live-test-monitor';
      container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 30px;
        border-radius: 15px;
        font-family: 'Courier New', monospace;
        font-size: 18px;
        z-index: 1000000;
        min-width: 500px;
        box-shadow: 0 0 50px rgba(102, 126, 234, 0.8);
        border: 2px solid #667eea;
        text-align: center;
        animation: fadeIn 0.5s ease-in;
      `;

      // Add animation styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 50px rgba(102, 126, 234, 0.8); }
          50% { box-shadow: 0 0 80px rgba(102, 126, 234, 1); }
        }
      `;
      document.head.appendChild(style);

      container.innerHTML = `
        <div style="animation: pulse 2s infinite;">
          <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Test Automation in Progress
          </div>
          <div style="font-size: 14px; color: #aaa; margin-bottom: 20px;">
            ${testName}
          </div>
          <div style="width: 40px; height: 40px; border: 4px solid #667eea; border-top-color: transparent; border-radius: 50%; margin: 20px auto; animation: spin 1s linear infinite;"></div>
          <div style="font-size: 12px; color: #667eea; margin-top: 20px;">
            Running...
          </div>
        </div>
      `;

      container.style.animation = 'fadeIn 0.5s ease-in, glow 2s infinite';
      document.body.appendChild(container);

      // Auto-hide after 3 seconds
      setTimeout(() => {
        container.style.transition = 'opacity 0.5s ease-out';
        container.style.opacity = '0';
        setTimeout(() => container.remove(), 500);
      }, 3000);
    }, testName);

    await this.page.waitForTimeout(3000);
  }

  /**
   * Show step execution notification
   */
  async showStep(stepName: string, stepNumber: number, totalSteps: number) {
    await this.page.evaluate(({ stepName, stepNumber, totalSteps }) => {
      let notification = document.getElementById('step-notification');
      
      if (!notification) {
        notification = document.createElement('div');
        notification.id = 'step-notification';
        document.body.appendChild(notification);
      }

      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 30px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 14px;
        z-index: 1000001;
        box-shadow: 0 5px 25px rgba(0,0,0,0.4);
        animation: slideDown 0.5s ease-out;
        font-weight: bold;
      `;

      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="font-size: 14px; font-weight: bold;">Step ${stepNumber}/${totalSteps}</div>
          <div>
            <div style="font-size: 12px; opacity: 0.9;">${stepName}</div>
          </div>
          <div style="
            width: ${(stepNumber / totalSteps) * 100}px;
            height: 4px;
            background: white;
            border-radius: 2px;
            margin-left: 10px;
          "></div>
        </div>
      `;

      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideDown {
          from { top: -100px; opacity: 0; }
          to { top: 20px; opacity: 1; }
        }
      `;
      if (!document.getElementById('step-animation-style')) {
        style.id = 'step-animation-style';
        document.head.appendChild(style);
      }
    }, { stepName, stepNumber, totalSteps });

    await this.page.waitForTimeout(1500);
  }

  /**
   * Show success celebration
   */
  async showSuccess(message: string = 'Test Passed') {
    await this.page.evaluate((message) => {
      const celebration = document.createElement('div');
      celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
        color: white;
        padding: 40px;
        border-radius: 20px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 28px;
        z-index: 1000002;
        box-shadow: 0 10px 50px rgba(76, 175, 80, 0.8);
        text-align: center;
        font-weight: bold;
        animation: successPop 0.5s ease-out;
      `;

      celebration.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px; font-weight: bold;">PASS</div>
        <div>${message}</div>
      `;

      const style = document.createElement('style');
      style.textContent = `
        @keyframes successPop {
          0% { transform: translate(-50%, -50%) scale(0); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(celebration);

      // Create confetti effect
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
          position: fixed;
          width: 10px;
          height: 10px;
          background: ${['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)]};
          top: 50%;
          left: 50%;
          animation: confettiFall ${2 + Math.random() * 2}s ease-out forwards;
          z-index: 1000001;
        `;
        
        const styleConfetti = document.createElement('style');
        styleConfetti.textContent = `
          @keyframes confettiFall {
            to {
              top: 100%;
              left: ${Math.random() * 100}%;
              transform: rotate(${Math.random() * 360}deg);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(styleConfetti);
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
      }

      setTimeout(() => {
        celebration.style.transition = 'opacity 0.5s';
        celebration.style.opacity = '0';
        setTimeout(() => celebration.remove(), 500);
      }, 3000);
    }, message);

    await this.page.waitForTimeout(3500);
  }

  /**
   * Show error notification
   */
  async showError(message: string = 'Test Failed') {
    await this.page.evaluate((message) => {
      const error = document.createElement('div');
      error.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);
        color: white;
        padding: 40px;
        border-radius: 20px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 28px;
        z-index: 1000002;
        box-shadow: 0 10px 50px rgba(244, 67, 54, 0.8);
        text-align: center;
        font-weight: bold;
        animation: shake 0.5s ease-out;
      `;

      error.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px; font-weight: bold;">FAIL</div>
        <div>${message}</div>
      `;

      const style = document.createElement('style');
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-50%, -50%) rotate(-5deg); }
          75% { transform: translate(-50%, -50%) rotate(5deg); }
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(error);

      setTimeout(() => {
        error.style.transition = 'opacity 0.5s';
        error.style.opacity = '0';
        setTimeout(() => error.remove(), 500);
      }, 3000);
    }, message);

    await this.page.waitForTimeout(3500);
  }

  /**
   * Clean up all monitoring overlays
   */
  async cleanup() {
    await this.page.evaluate(() => {
      const elements = [
        'live-test-monitor',
        'step-notification',
        'test-breadcrumbs',
        'perf-overlay',
        'network-indicator',
        'a11y-overlay'
      ];
      
      elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    });
  }
}

