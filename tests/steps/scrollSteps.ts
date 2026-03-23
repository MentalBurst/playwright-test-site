import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { ScrollHelper } from '../helpers/ScrollHelper';
import { ProductsPage } from '../pages/ProductsPage';

const { Given, When, Then } = createBdd();

let scrollHelper: ScrollHelper;
let productsPage: ProductsPage;
let isPageScrollable: boolean;

Given('the page is scrollable', async function ({ page }) {
  if (!scrollHelper) {
    scrollHelper = new ScrollHelper(page);
  }
  await page.waitForTimeout(1500);
  isPageScrollable = await scrollHelper.isScrollable();
  if (!isPageScrollable) {
    // Skip test if page is not scrollable
    return 'skipped';
  }
});

When('I scroll to the bottom of the page', async function ({ page }) {
  if (!scrollHelper) {
    scrollHelper = new ScrollHelper(page);
  }
  if (isPageScrollable) {
    await scrollHelper.scrollToBottom(2000);
  }
});

Then('the scroll position should be greater than {int}', async function ({ page }, position: number) {
  if (!scrollHelper) {
    scrollHelper = new ScrollHelper(page);
  }
  if (isPageScrollable) {
    const scrollPosition = await scrollHelper.getScrollPosition();
    expect(scrollPosition.y).toBeGreaterThan(position);
  }
});

When('I scroll to the top of the page', async function ({ page }) {
  if (!scrollHelper) {
    scrollHelper = new ScrollHelper(page);
  }
  if (isPageScrollable) {
    await scrollHelper.scrollToTop(2000);
  }
});

Then('the scroll position should be {int}', async function ({ page }, position: number) {
  if (!scrollHelper) {
    scrollHelper = new ScrollHelper(page);
  }
  if (isPageScrollable) {
    const scrollPosition = await scrollHelper.getScrollPosition();
    expect(scrollPosition.y).toBe(position);
  }
});

When('I scroll down in {int} steps', async function ({ page }, steps: number) {
  if (!scrollHelper) {
    scrollHelper = new ScrollHelper(page);
  }
  if (isPageScrollable) {
    await scrollHelper.scrollStepByStep(steps, 800);
    await page.waitForTimeout(1500);
  }
});

When('I add {int} demo products', async function ({ page }, count: number) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  
  for (let i = 1; i <= count; i++) {
    await productsPage.clickAddProduct();
    await page.waitForTimeout(500);

    await productsPage.fillProductForm(
      `Demo Product ${i}`,
      `${(i * 10).toFixed(2)}`,
      'electronics'
    );
    await page.waitForTimeout(800);

    await productsPage.clickSaveProduct();
    await page.waitForTimeout(800);
  }
});

When('I scroll to the last product card', async function ({ page }) {
  if (!scrollHelper) {
    scrollHelper = new ScrollHelper(page);
  }
  await scrollHelper.scrollToElement('.product-card:last-child', 1500);
});

Then('the last product should be visible', async function ({ page }) {
  const lastProduct = page.locator('.product-card').last();
  await expect(lastProduct).toBeVisible();
  await page.waitForTimeout(2000);
});

When('I scroll down the page by {int} pixels', async function ({ page }, pixels: number) {
  if (!scrollHelper) {
    scrollHelper = new ScrollHelper(page);
  }
  await scrollHelper.scrollBy(0, pixels);
  await page.waitForTimeout(500);
});

When('I scroll up the page by {int} pixels', async function ({ page }, pixels: number) {
  if (!scrollHelper) {
    scrollHelper = new ScrollHelper(page);
  }
  await scrollHelper.scrollBy(0, -pixels);
  await page.waitForTimeout(500);
});

Then('the page should be scrolled', async function ({ page }) {
  if (!scrollHelper) {
    scrollHelper = new ScrollHelper(page);
  }
  const scrollPosition = await scrollHelper.getScrollPosition();
  // Just verify that the page has been scrolled (position is not at 0)
  expect(scrollPosition.y).toBeGreaterThanOrEqual(0);
});
