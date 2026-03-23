import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface A11yIssue {
  level: 'error' | 'warning' | 'notice';
  element: string;
  description: string;
  rule: string;
}

export class AccessibilityHelper {
  private page: Page;
  private issues: A11yIssue[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Run basic accessibility checks
   */
  async runA11yChecks(): Promise<A11yIssue[]> {
    this.issues = await this.page.evaluate(() => {
      const issues: A11yIssue[] = [];

      // Check for missing alt attributes on images
      document.querySelectorAll('img').forEach((img, index) => {
        if (!img.hasAttribute('alt')) {
          issues.push({
            level: 'error',
            element: `img[${index}]`,
            description: 'Image missing alt attribute',
            rule: 'WCAG 1.1.1 - Non-text Content'
          });
        }
      });

      // Check for missing form labels
      document.querySelectorAll('input, textarea, select').forEach((input, index) => {
        const id = input.getAttribute('id');
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          if (!label && input.getAttribute('aria-label') === null) {
            issues.push({
              level: 'error',
              element: `${input.tagName.toLowerCase()}#${id}`,
              description: 'Form input missing associated label or aria-label',
              rule: 'WCAG 1.3.1 - Info and Relationships'
            });
          }
        }
      });

      // Check for low contrast text
      const elements = document.querySelectorAll('p, span, div, a, button, label');
      elements.forEach((el, index) => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        
        // Simple contrast check (simplified)
        if (color && bgColor && color !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgba(0, 0, 0, 0)') {
          // This is a simplified check; real contrast calculation is complex
          const colorValues = color.match(/\d+/g);
          const bgValues = bgColor.match(/\d+/g);
          
          if (colorValues && bgValues) {
            const colorBrightness = (parseInt(colorValues[0]) + parseInt(colorValues[1]) + parseInt(colorValues[2])) / 3;
            const bgBrightness = (parseInt(bgValues[0]) + parseInt(bgValues[1]) + parseInt(bgValues[2])) / 3;
            const diff = Math.abs(colorBrightness - bgBrightness);
            
            if (diff < 50) {
              issues.push({
                level: 'warning',
                element: `${el.tagName.toLowerCase()}[${index}]`,
                description: 'Potential low contrast between text and background',
                rule: 'WCAG 1.4.3 - Contrast (Minimum)'
              });
            }
          }
        }
      });

      // Check for missing page title
      if (!document.title || document.title.trim() === '') {
        issues.push({
          level: 'error',
          element: 'document',
          description: 'Page missing title',
          rule: 'WCAG 2.4.2 - Page Titled'
        });
      }

      // Check for proper heading hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      if (headings.length > 0) {
        const h1Count = document.querySelectorAll('h1').length;
        if (h1Count === 0) {
          issues.push({
            level: 'warning',
            element: 'document',
            description: 'Page missing H1 heading',
            rule: 'WCAG 1.3.1 - Info and Relationships'
          });
        }
        if (h1Count > 1) {
          issues.push({
            level: 'warning',
            element: 'document',
            description: 'Multiple H1 headings found',
            rule: 'WCAG 1.3.1 - Info and Relationships'
          });
        }
      }

      // Check for clickable elements without proper attributes
      document.querySelectorAll('[onclick], .clickable, .btn').forEach((el, index) => {
        if (el.tagName !== 'BUTTON' && el.tagName !== 'A' && !el.hasAttribute('role')) {
          issues.push({
            level: 'warning',
            element: `${el.tagName.toLowerCase()}[${index}]`,
            description: 'Clickable element without proper semantic tag or role',
            rule: 'WCAG 4.1.2 - Name, Role, Value'
          });
        }
      });

      return issues;
    });

    await this.displayA11yResults();
    return this.issues;
  }

  /**
   * Display accessibility results as overlay
   */
  private async displayA11yResults() {
    const errorCount = this.issues.filter(i => i.level === 'error').length;
    const warningCount = this.issues.filter(i => i.level === 'warning').length;

    await this.page.evaluate(({ errorCount, warningCount, issues }) => {
      let overlay = document.getElementById('a11y-overlay');
      if (overlay) overlay.remove();

      overlay = document.createElement('div');
      overlay.id = 'a11y-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: 'Arial', sans-serif;
        font-size: 12px;
        z-index: 999999;
        max-width: 350px;
        max-height: 400px;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      `;

      let statusColor = errorCount > 0 ? '#ff4444' : warningCount > 0 ? '#ffaa00' : '#00ff00';
      let statusLabel = errorCount > 0 ? 'FAIL' : warningCount > 0 ? 'WARN' : 'PASS';

      overlay.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px; border-bottom: 2px solid ${statusColor}; padding-bottom: 8px;">
          [${statusLabel}] Accessibility Report
        </div>
        <div style="margin-bottom: 10px;">
          <div style="color: #ff4444;">Errors: ${errorCount}</div>
          <div style="color: #ffaa00;">Warnings: ${warningCount}</div>
        </div>
        <div style="max-height: 250px; overflow-y: auto;">
          ${issues.slice(0, 10).map((issue: any) => `
            <div style="margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; border-left: 3px solid ${issue.level === 'error' ? '#ff4444' : '#ffaa00'};">
              <div style="font-weight: bold; color: ${issue.level === 'error' ? '#ff4444' : '#ffaa00'};">${issue.level.toUpperCase()}</div>
              <div style="font-size: 11px; margin-top: 4px;">${issue.description}</div>
              <div style="font-size: 10px; color: #aaa; margin-top: 2px;">${issue.element}</div>
            </div>
          `).join('')}
          ${issues.length > 10 ? `<div style="text-align: center; margin-top: 8px; color: #aaa;">...and ${issues.length - 10} more issues</div>` : ''}
        </div>
      `;

      document.body.appendChild(overlay);

      // Auto-fade after 5 seconds
      setTimeout(() => {
        if (overlay) overlay.style.opacity = '0.3';
      }, 5000);
    }, { errorCount, warningCount, issues: this.issues });
  }

  /**
   * Save accessibility report
   */
  async saveReport(filename: string = 'accessibility-report.json') {
    const reportPath = path.join(process.cwd(), 'test-results', filename);
    const dir = path.dirname(reportPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const report = {
      timestamp: new Date().toISOString(),
      url: this.page.url(),
      summary: {
        total: this.issues.length,
        errors: this.issues.filter(i => i.level === 'error').length,
        warnings: this.issues.filter(i => i.level === 'warning').length,
        notices: this.issues.filter(i => i.level === 'notice').length,
      },
      issues: this.issues,
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`Accessibility report saved: ${reportPath}`);
  }
}

