import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';
import { VisualHelper } from '../helpers/VisualHelper';

const { Given, When, Then } = createBdd();

let productsPage: ProductsPage;
let initialProductCount: number;
let visualHelper: VisualHelper;

Then('I should see at least {int} products', async function ({ page }, count: number) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  const productCount = await productsPage.getProductCount();
  expect(productCount).toBeGreaterThanOrEqual(count);
});

Then('each product should display name, category, and price', async function ({ page }) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  const products = await productsPage.getVisibleProducts();
  const firstProduct = products.first();
  await expect(firstProduct.locator('[data-testid="product-name"]')).toBeVisible();
  await expect(firstProduct.locator('[data-testid="product-category"]')).toBeVisible();
  await expect(firstProduct.locator('[data-testid="product-price"]')).toBeVisible();
});

When('I search for {string}', async function ({ page }, searchTerm: string) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  await productsPage.search(searchTerm);
});

Then('I should see products containing {string} in their name', async function ({ page }, text: string) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  const products = await productsPage.getVisibleProducts();
  const count = await products.count();
  expect(count).toBeGreaterThan(0);
  
  const firstProductText = await products.first().textContent();
  expect(firstProductText?.toLowerCase()).toContain(text);
});

When('I click the add product button', async function ({ page }) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  await page.waitForTimeout(1500);
  await productsPage.clickAddProduct();
  await page.waitForTimeout(1500);
});

Then('I should see the product modal', async function ({ page }) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  await expect(productsPage.modal).toBeVisible();
});

When('I fill the product form with name {string}, price {string}, and category {string}', async function ({ page }, name: string, price: string, category: string) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  if (!visualHelper) {
    visualHelper = new VisualHelper(page);
  }
  
  // Highlight form fields as they're being filled
  await visualHelper.highlightElement('[data-testid="product-name-input"]', '#ffff00');
  await page.waitForTimeout(300);
  
  await visualHelper.highlightElement('[data-testid="product-price-input"]', '#ffff00');
  await page.waitForTimeout(300);
  
  await visualHelper.highlightElement('[data-testid="product-category-select"]', '#ffff00');
  await page.waitForTimeout(300);
  
  await productsPage.fillProductForm(name, price, category);
  
  // Highlight in green when done
  await visualHelper.highlightElement('[data-testid="product-category-select"]', '#00ff00');
  await visualHelper.addBreadcrumb(`Product form filled: ${name}`);
});

When('I click the save product button', async function ({ page }) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  await productsPage.clickSaveProduct();
});

Then('I should see a product with name {string}', async function ({ page }, productName: string) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  const isVisible = await productsPage.isProductVisible(productName);
  expect(isVisible).toBe(true);
});

Given('a product with name {string} exists', async function ({ page }, productName: string) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  const isVisible = await productsPage.isProductVisible(productName);
  expect(isVisible).toBe(true);
});

When('I confirm deletion', async function ({ page }) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  await productsPage.confirmDeletion();
});

When('I delete the product {string}', async function ({ page }, productName: string) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  await productsPage.deleteProduct(productName);
  await page.waitForTimeout(500);
});

Then('the product {string} should not be visible', async function ({ page }, productName: string) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  const stillVisible = await productsPage.isProductVisible(productName);
  expect(stillVisible).toBe(false);
});

Given('I note the current number of products', async function ({ page }) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  initialProductCount = await productsPage.getProductCount();
});

When('I click the cancel button', async function ({ page }) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  await productsPage.clickCancel();
  await page.waitForTimeout(1500);
});

Then('the number of products should remain the same', async function ({ page }) {
  if (!productsPage) {
    productsPage = new ProductsPage(page);
  }
  const finalCount = await productsPage.getProductCount();
  expect(finalCount).toBe(initialProductCount);
});

