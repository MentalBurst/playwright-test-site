import { Page, Locator } from '@playwright/test';

interface ElementStrategy {
  strategy: string;
  selector: string;
  priority: number;
}

export class SmartLocator {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Create a self-healing locator with multiple fallback strategies
   */
  async findElement(primarySelector: string, options: {
    text?: string;
    role?: string;
    testId?: string;
    fallbackSelectors?: string[];
  } = {}): Promise<Locator> {
    const strategies: ElementStrategy[] = [
      { strategy: 'primary', selector: primarySelector, priority: 1 },
    ];

    // Add alternative strategies
    if (options.testId) {
      strategies.push({ 
        strategy: 'testId', 
        selector: `[data-testid="${options.testId}"]`, 
        priority: 2 
      });
    }

    if (options.text) {
      strategies.push({ 
        strategy: 'text', 
        selector: `text=${options.text}`, 
        priority: 3 
      });
    }

    if (options.role) {
      strategies.push({ 
        strategy: 'role', 
        selector: `role=${options.role}`, 
        priority: 4 
      });
    }

    if (options.fallbackSelectors) {
      options.fallbackSelectors.forEach((selector, index) => {
        strategies.push({ 
          strategy: `fallback-${index}`, 
          selector, 
          priority: 5 + index 
        });
      });
    }

    // Try each strategy in order
    for (const strategy of strategies.sort((a, b) => a.priority - b.priority)) {
      try {
        const locator = this.page.locator(strategy.selector);
        const count = await locator.count();
        
        if (count > 0) {
          console.log(`Element found using strategy: ${strategy.strategy} (${strategy.selector})`);
          await this.highlightElement(locator, '#00ff00');
          return locator;
        }
      } catch (error) {
        // Continue to next strategy
      }
    }

    // If all strategies fail, throw error
    throw new Error(`Could not locate element with any strategy. Primary: ${primarySelector}`);
  }

  /**
   * Highlight element on page with color
   */
  private async highlightElement(locator: Locator, color: string) {
    try {
      await locator.evaluate((el, color) => {
        const original = (el as HTMLElement).style.outline;
        (el as HTMLElement).style.outline = `3px solid ${color}`;
        (el as HTMLElement).style.outlineOffset = '2px';
        (el as HTMLElement).style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
          (el as HTMLElement).style.outline = original;
        }, 1000);
      }, color);
    } catch (error) {
      // Ignore highlighting errors
    }
  }
}
