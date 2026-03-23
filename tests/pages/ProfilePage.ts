import { Page, Locator, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly bioInput: Locator;
  readonly saveProfileButton: Locator;
  readonly successMessage: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly changePasswordButton: Locator;
  readonly passwordError: Locator;
  readonly passwordSuccess: Locator;
  readonly navProfile: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput = page.locator('[data-testid="fullname-input"]');
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.phoneInput = page.locator('[data-testid="phone-input"]');
    this.bioInput = page.locator('[data-testid="bio-input"]');
    this.saveProfileButton = page.locator('[data-testid="save-profile-button"]');
    this.successMessage = page.locator('#successMessage');
    this.currentPasswordInput = page.locator('[data-testid="current-password-input"]');
    this.newPasswordInput = page.locator('[data-testid="new-password-input"]');
    this.confirmPasswordInput = page.locator('[data-testid="confirm-password-input"]');
    this.changePasswordButton = page.locator('[data-testid="change-password-button"]');
    this.passwordError = page.locator('#passwordError');
    this.passwordSuccess = page.locator('#passwordSuccess');
    this.navProfile = page.locator('[data-testid="nav-profile"]');
  }

  async goto() {
    await this.page.goto('/profile.html');
  }

  async fillProfileForm(data: { fullName?: string; email?: string; phone?: string; bio?: string }) {
    if (data.fullName) await this.fullNameInput.fill(data.fullName);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.phone) await this.phoneInput.fill(data.phone);
    if (data.bio) await this.bioInput.fill(data.bio);
  }

  async clickSaveProfile() {
    await this.saveProfileButton.click();
  }

  async fillPasswordForm(data: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    await this.currentPasswordInput.fill(data.currentPassword);
    await this.newPasswordInput.fill(data.newPassword);
    await this.confirmPasswordInput.fill(data.confirmPassword);
  }

  async clickChangePassword() {
    await this.changePasswordButton.click();
  }

  async getSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible' });
    return await this.successMessage.textContent() || '';
  }

  async getPasswordSuccessMessage(): Promise<string> {
    await this.passwordSuccess.waitFor({ state: 'visible' });
    return await this.passwordSuccess.textContent() || '';
  }

  async getPasswordErrorMessage(): Promise<string> {
    await this.passwordError.waitFor({ state: 'visible' });
    return await this.passwordError.textContent() || '';
  }

  async isSectionVisible(sectionName: string): Promise<boolean> {
    const heading = this.page.locator('h2', { hasText: sectionName });
    return await heading.isVisible();
  }

  async fillFullName(name: string) {
    await this.fullNameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPhone(phone: string) {
    await this.phoneInput.fill(phone);
  }

  async fillBio(bio: string) {
    await this.bioInput.fill(bio);
  }

  async saveProfile() {
    await this.saveProfileButton.click();
  }
}

