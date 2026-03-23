import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { VisualHelper } from '../helpers/VisualHelper';
import { PerformanceHelper } from '../helpers/PerformanceHelper';

const { Given, When, Then } = createBdd();

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let visualHelper: VisualHelper;
let performanceHelper: PerformanceHelper;

Given('I clear all cookies and local storage', async function ({ page, context }) {
  await context.clearCookies();
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  
  visualHelper = new VisualHelper(page);
  performanceHelper = new PerformanceHelper(page);
  
  await visualHelper.addBreadcrumb('Cleared cookies and storage');
});

Given('I am on the login page', async function ({ page }) {
  loginPage = new LoginPage(page);
  await loginPage.goto();
  
  if (!visualHelper) visualHelper = new VisualHelper(page);
  if (!performanceHelper) performanceHelper = new PerformanceHelper(page);
  
  await visualHelper.addBreadcrumb('Navigated to login page');
  await performanceHelper.monitorNetwork();
  
  await page.waitForTimeout(1000);
});

When('I login with username {string} and password {string}', async function ({ page }, username: string, password: string) {
  loginPage = new LoginPage(page);
  
  if (!visualHelper) visualHelper = new VisualHelper(page);
  if (!performanceHelper) performanceHelper = new PerformanceHelper(page);
  
  await visualHelper.addBreadcrumb(`Logging in as ${username}`);
  await visualHelper.highlightElement('[data-testid="username-input"]', '#00ff00');
  
  await page.waitForTimeout(1000);
  await loginPage.login(username, password);
  await page.waitForTimeout(1500);
  
  await performanceHelper.captureMetrics('Login Action');
});

When('I enter username {string}', async function ({ page }, username: string) {
  if (!loginPage) {
    loginPage = new LoginPage(page);
  }
  await loginPage.fillUsername(username);
});

When('I enter password {string}', async function ({ page }, password: string) {
  if (!loginPage) {
    loginPage = new LoginPage(page);
  }
  await loginPage.fillPassword(password);
});

When('I click the login button', async function ({ page }) {
  if (!loginPage) {
    loginPage = new LoginPage(page);
  }
  await loginPage.clickLoginButton();
});

When('I login with username {string} and password {string} with remember me checked', async function ({ page }, username: string, password: string) {
  if (!loginPage) {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  }
  await loginPage.loginWithRememberMe(username, password);
});

When('I click the logout button', async function ({ page }) {
  if (!dashboardPage) {
    dashboardPage = new DashboardPage(page);
  }
  await page.waitForTimeout(1500);
  await dashboardPage.logout();
  await page.waitForTimeout(1500);
});

Then('I should be redirected to the dashboard page', async function ({ page }) {
  await expect(page).toHaveURL(/.*dashboard.html/);
  
  if (!visualHelper) visualHelper = new VisualHelper(page);
  if (!performanceHelper) performanceHelper = new PerformanceHelper(page);
  
  await visualHelper.addBreadcrumb('Dashboard loaded successfully');
  await performanceHelper.captureMetrics('Dashboard Page Load');
  
  await page.waitForTimeout(1000);
});

Then('I should see a welcome message containing {string}', async function ({ page }, text: string) {
  if (!dashboardPage) {
    dashboardPage = new DashboardPage(page);
  }
  const userText = await dashboardPage.getUserDisplayText();
  expect(userText).toContain(text);
  
  if (!visualHelper) visualHelper = new VisualHelper(page);
  await visualHelper.addBreadcrumb('Welcome message verified');
});

Then('I should see an error message {string}', async function ({ page }, errorText: string) {
  if (!loginPage) {
    loginPage = new LoginPage(page);
  }
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toContain(errorText);
});

Then('I should remain on the login page', async function ({ page }) {
  await expect(page).toHaveURL(/.*index.html|\/$/);
});

Then('the remember me should be stored in local storage', async function ({ page }) {
  const rememberMe = await page.evaluate(() => localStorage.getItem('rememberMe'));
  expect(rememberMe).toBe('true');
});

Then('I should be redirected to the login page', async function ({ page }) {
  await expect(page).toHaveURL(/.*index.html|\/$/);
  await page.waitForTimeout(1000);
});

Then('I should not be logged in', async function ({ page }) {
  const isLoggedIn = await page.evaluate(() => localStorage.getItem('isLoggedIn'));
  expect(isLoggedIn).not.toBe('true');
});

Given('I am on the dashboard page', async function ({ page }) {
  dashboardPage = new DashboardPage(page);
  await dashboardPage.goto();
});

