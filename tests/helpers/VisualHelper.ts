import { Page } from '@playwright/test';

export class VisualHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Highlight elements on the page with animation
   */
  async highlightElement(selector: string, color: string = '#00ff00') {
    await this.page.evaluate(({ selector, color }) => {
      const element = document.querySelector(selector);
      if (element) {
        const original = (element as HTMLElement).style.outline;
        (element as HTMLElement).style.outline = `3px solid ${color}`;
        (element as HTMLElement).style.outlineOffset = '2px';
        setTimeout(() => {
          (element as HTMLElement).style.outline = original;
        }, 2000);
      }
    }, { selector, color });
  }

  /**
   * Add visual breadcrumbs to show test path
   */
  async addBreadcrumb(text: string) {
    await this.page.evaluate((text) => {
      let breadcrumbContainer = document.getElementById('test-breadcrumbs');
      if (!breadcrumbContainer) {
        breadcrumbContainer = document.createElement('div');
        breadcrumbContainer.id = 'test-breadcrumbs';
        breadcrumbContainer.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: #00ff00;
          padding: 10px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 12px;
          z-index: 999998;
          max-width: 300px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(breadcrumbContainer);
      }
      const timestamp = new Date().toLocaleTimeString();
      const crumb = document.createElement('div');
      crumb.textContent = `${timestamp} - ${text}`;
      crumb.style.cssText = `
        margin: 2px 0;
        padding: 2px 5px;
        background: rgba(0, 255, 0, 0.1);
        border-left: 2px solid #00ff00;
      `;
      breadcrumbContainer.appendChild(crumb);
      
      // Keep only last 5 breadcrumbs
      while (breadcrumbContainer.children.length > 5) {
        breadcrumbContainer.removeChild(breadcrumbContainer.firstChild!);
      }
    }, text);
  }
}
