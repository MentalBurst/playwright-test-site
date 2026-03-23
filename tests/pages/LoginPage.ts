import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.rememberMeCheckbox = page.locator('[data-testid="remember-checkbox"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('#errorMessage');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    // DELAY: Wait to see username being typed
    await this.page.waitForTimeout(800);
    
    await this.passwordInput.fill(password);
    // DELAY: Wait to see password being typed
    await this.page.waitForTimeout(800);
    
    await this.loginButton.click();
    // DELAY: Wait to see login button click
    await this.page.waitForTimeout(500);
  }

  async loginWithRememberMe(username: string, password: string) {
    await this.usernameInput.fill(username);
    // DELAY: Wait to see username being typed
    await this.page.waitForTimeout(800);
    
    await this.passwordInput.fill(password);
    // DELAY: Wait to see password being typed
    await this.page.waitForTimeout(800);
    
    await this.rememberMeCheckbox.check();
    // DELAY: Wait to see checkbox being checked
    await this.page.waitForTimeout(800);
    
    await this.loginButton.click();
    // DELAY: Wait to see login button click
    await this.page.waitForTimeout(500);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async checkRememberMe() {
    await this.rememberMeCheckbox.check();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return await this.errorMessage.textContent() || '';
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}

