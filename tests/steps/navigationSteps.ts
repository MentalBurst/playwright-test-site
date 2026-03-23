import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

const { Given, When, Then } = createBdd();

let dashboardPage: DashboardPage;

Given('I am on the products page', async function ({ page }) {
  await page.goto('/products.html');
});

When('I click on the {string} navigation link', async function ({ page }, linkName: string) {
  if (!dashboardPage) {
    dashboardPage = new DashboardPage(page);
  }
  await dashboardPage.clickNavLink(linkName);
});

Then('I should be on the dashboard page', async function ({ page }) {
  await expect(page).toHaveURL(/.*dashboard.html/);
});

Then('I should be on the products page', async function ({ page }) {
  await expect(page).toHaveURL(/.*products.html/);
});

Then('I should be on the profile page', async function ({ page }) {
  await expect(page).toHaveURL(/.*profile.html/);
});

Then('the {string} navigation link should be active', async function ({ page }, linkName: string) {
  if (!dashboardPage) {
    dashboardPage = new DashboardPage(page);
  }
  const isActive = await dashboardPage.isNavLinkActive(linkName);
  expect(isActive).toBe(true);
});

Then('I should see the total users statistic', async function ({ page }) {
  if (!dashboardPage) {
    dashboardPage = new DashboardPage(page);
  }
  await page.waitForTimeout(1500);
  await expect(dashboardPage.totalUsers).toBeVisible();
  await page.waitForTimeout(500);
});

Then('I should see the total revenue statistic', async function ({ page }) {
  if (!dashboardPage) {
    dashboardPage = new DashboardPage(page);
  }
  await expect(dashboardPage.totalRevenue).toBeVisible();
  await page.waitForTimeout(500);
});

Then('I should see the total products statistic', async function ({ page }) {
  if (!dashboardPage) {
    dashboardPage = new DashboardPage(page);
  }
  await expect(dashboardPage.totalProducts).toBeVisible();
  await page.waitForTimeout(500);
});

Then('I should see the total activity statistic', async function ({ page }) {
  if (!dashboardPage) {
    dashboardPage = new DashboardPage(page);
  }
  await expect(dashboardPage.totalActivity).toBeVisible();
  await page.waitForTimeout(500);
});

Then('I should see the activity list', async function ({ page }) {
  if (!dashboardPage) {
    dashboardPage = new DashboardPage(page);
  }
  await expect(dashboardPage.activityList).toBeVisible();
  await page.waitForTimeout(1000);
});

