import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly userDisplay: Locator;
  readonly logoutButton: Locator;
  readonly totalUsers: Locator;
  readonly totalRevenue: Locator;
  readonly totalProducts: Locator;
  readonly totalActivity: Locator;
  readonly activityList: Locator;
  readonly navDashboard: Locator;
  readonly navProducts: Locator;
  readonly navProfile: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userDisplay = page.locator('[data-testid="user-display"]');
    this.logoutButton = page.locator('[data-testid="nav-logout"]');
    this.totalUsers = page.locator('[data-testid="total-users"]');
    this.totalRevenue = page.locator('[data-testid="total-revenue"]');
    this.totalProducts = page.locator('[data-testid="total-products"]');
    this.totalActivity = page.locator('[data-testid="total-activity"]');
    this.activityList = page.locator('[data-testid="activity-list"]');
    this.navDashboard = page.locator('[data-testid="nav-dashboard"]');
    this.navProducts = page.locator('[data-testid="nav-products"]');
    this.navProfile = page.locator('[data-testid="nav-profile"]');
  }

  async goto() {
    await this.page.goto('/dashboard.html');
  }

  async logout() {
    await this.logoutButton.click();
  }

  async getUserDisplayText(): Promise<string> {
    return await this.userDisplay.textContent() || '';
  }

  async clickNavLink(linkName: string) {
    const links: { [key: string]: Locator } = {
      'Dashboard': this.navDashboard,
      'Products': this.navProducts,
      'Profile': this.navProfile,
    };
    await links[linkName].click();
  }

  async isNavLinkActive(linkName: string): Promise<boolean> {
    const links: { [key: string]: Locator } = {
      'Dashboard': this.navDashboard,
      'Products': this.navProducts,
      'Profile': this.navProfile,
    };
    const classes = await links[linkName].getAttribute('class');
    return classes?.includes('active') || false;
  }
}

