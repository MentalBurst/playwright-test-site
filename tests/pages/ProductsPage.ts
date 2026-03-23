import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly productsGrid: Locator;
  readonly addProductButton: Locator;
  readonly modal: Locator;
  readonly modalClose: Locator;
  readonly productNameInput: Locator;
  readonly productPriceInput: Locator;
  readonly productCategorySelect: Locator;
  readonly saveProductButton: Locator;
  readonly cancelButton: Locator;
  readonly navProducts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.productsGrid = page.locator('[data-testid="products-grid"]');
    this.addProductButton = page.locator('[data-testid="add-product-button"]');
    this.modal = page.locator('#addProductModal');
    this.modalClose = page.locator('[data-testid="modal-close"]');
    this.productNameInput = page.locator('[data-testid="product-name-input"]');
    this.productPriceInput = page.locator('[data-testid="product-price-input"]');
    this.productCategorySelect = page.locator('[data-testid="product-category-select"]');
    this.saveProductButton = page.locator('[data-testid="save-product-button"]');
    this.cancelButton = page.locator('[data-testid="cancel-button"]');
    this.navProducts = page.locator('[data-testid="nav-products"]');
  }

  async goto() {
    await this.page.goto('/products.html');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    // DELAY: Wait to see search term being typed and filter applied
    await this.page.waitForTimeout(1000);
  }

  async searchProducts(term: string) {
    await this.search(term);
  }

  async clickAddProduct() {
    await this.addProductButton.click();
    // DELAY: Wait to see modal opening animation
    await this.page.waitForTimeout(500);
    await this.modal.waitFor({ state: 'visible' });
  }

  async fillProductForm(name: string, price: string, category: string) {
    // Wait for form to be ready
    await this.productNameInput.waitFor({ state: 'visible' });
    
    // Fill name
    await this.productNameInput.fill(name);
    console.log(`Filled product name: ${name}`);
    // DELAY: Wait to see name being typed
    await this.page.waitForTimeout(800);
    
    // Fill price
    await this.productPriceInput.fill(price);
    console.log(`Filled product price: ${price}`);
    // DELAY: Wait to see price being typed
    await this.page.waitForTimeout(800);
    
    // Select category - with improved handling
    await this.productCategorySelect.waitFor({ state: 'visible' });
    await this.productCategorySelect.selectOption({ value: category });
    
    // Verify the selection was made
    const selectedValue = await this.productCategorySelect.inputValue();
    if (selectedValue !== category) {
      console.warn(`Category selection mismatch: expected "${category}", got "${selectedValue}"`);
      // Try again
      await this.page.waitForTimeout(500);
      await this.productCategorySelect.selectOption({ value: category });
    }
    
    console.log(`Selected category: ${category}`);
    // DELAY: Wait to see category being selected
    await this.page.waitForTimeout(800);
  }

  async clickSaveProduct() {
    await this.saveProductButton.click();
    // DELAY: Wait to see save action and modal closing
    await this.page.waitForTimeout(500);
    await this.modal.waitFor({ state: 'hidden' });
  }

  async clickCancel() {
    await this.cancelButton.click();
    // DELAY: Wait to see cancel action and modal closing
    await this.page.waitForTimeout(500);
    await this.modal.waitFor({ state: 'hidden' });
  }

  async isModalVisible(): Promise<boolean> {
    return await this.modal.isVisible();
  }

  async getProductCount(): Promise<number> {
    return await this.productsGrid.locator('.product-card').count();
  }

  async getVisibleProducts() {
    return await this.productsGrid.locator('.product-card:visible');
  }

  async findProductByName(name: string) {
    return this.page.locator('.product-card').filter({ hasText: name });
  }

  async deleteProduct(name: string) {
    const product = await this.findProductByName(name);
    const deleteButton = product.locator('.delete-btn');
    await deleteButton.click();
  }

  async confirmDeletion() {
    // Handle the browser's confirm dialog
    this.page.on('dialog', dialog => dialog.accept());
  }

  async isProductVisible(name: string): Promise<boolean> {
    const product = await this.findProductByName(name);
    return await product.isVisible().catch(() => false);
  }
}
