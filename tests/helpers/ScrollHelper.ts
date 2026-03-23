import { Page } from '@playwright/test';

/**
 * ScrollHelper - Utility class for scroll operations
 * Provides methods to scroll pages with visual delays for test visibility
 */
export class ScrollHelper {
  constructor(private page: Page) {}

  /**
   * Scroll to the bottom of the page smoothly
   * @param delayMs - Optional delay after scrolling (default: 1000ms)
   */
  async scrollToBottom(delayMs: number = 1000): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });
    // DELAY: Wait to see scroll to bottom
    await this.page.waitForTimeout(delayMs);
  }

  /**
   * Scroll to the top of the page smoothly
   * @param delayMs - Optional delay after scrolling (default: 1000ms)
   */
  async scrollToTop(delayMs: number = 1000): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    // DELAY: Wait to see scroll to top
    await this.page.waitForTimeout(delayMs);
  }

  /**
   * Scroll by a specific amount of pixels
   * @param pixels - Number of pixels to scroll (positive = down, negative = up)
   * @param delayMs - Optional delay after scrolling (default: 500ms)
   */
  async scrollBy(pixels: number, delayMs: number = 500): Promise<void> {
    await this.page.evaluate((px) => {
      window.scrollBy({
        top: px,
        behavior: 'smooth'
      });
    }, pixels);
    // DELAY: Wait to see scroll movement
    await this.page.waitForTimeout(delayMs);
  }

  /**
   * Scroll to a specific element to bring it into view
   * @param selector - CSS selector or data-testid of the element
   * @param delayMs - Optional delay after scrolling (default: 800ms)
   */
  async scrollToElement(selector: string, delayMs: number = 800): Promise<void> {
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(delayMs);
  }

  async getScrollPosition(): Promise<{ x: number; y: number }> {
    return await this.page.evaluate(() => {
      return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
      };
    });
  }

  /**
   * Check if page is scrollable
   * @returns true if page has scrollable content
   */
  async isScrollable(): Promise<boolean> {
    return await this.page.evaluate(() => {
      return document.body.scrollHeight > window.innerHeight;
    });
  }

  /**
   * Scroll step by step with pauses (good for demos)
   * @param steps - Number of steps to divide the scroll into
   * @param delayBetweenSteps - Delay between each step (default: 500ms)
   */
  async scrollStepByStep(steps: number = 5, delayBetweenSteps: number = 500): Promise<void> {
    const scrollHeight = await this.page.evaluate(() => document.body.scrollHeight);
    const stepSize = scrollHeight / steps;

    for (let i = 1; i <= steps; i++) {
      await this.page.evaluate((position) => {
        window.scrollTo({
          top: position,
          behavior: 'smooth'
        });
      }, stepSize * i);
      // DELAY: Pause between steps for visibility
      await this.page.waitForTimeout(delayBetweenSteps);
    }
  }
}

