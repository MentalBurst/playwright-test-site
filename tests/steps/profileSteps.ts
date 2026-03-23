import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { ProfilePage } from '../pages/ProfilePage';

const { Given, When, Then } = createBdd();

let profilePage: ProfilePage;

Given('I am on the profile page', async function ({ page }) {
  profilePage = new ProfilePage(page);
  await profilePage.goto();
});

Then('I should see the {string} section', async function ({ page }, sectionName: string) {
  if (!profilePage) {
    profilePage = new ProfilePage(page);
  }
  const isVisible = await profilePage.isSectionVisible(sectionName);
  expect(isVisible).toBe(true);
});

When('I fill the profile form with:', async function ({ page }, dataTable) {
  if (!profilePage) {
    profilePage = new ProfilePage(page);
  }
  const data: any = {};
  const rows = dataTable.hashes();
  rows.forEach((row: any) => {
    data[row.field] = row.value;
  });
  
  await profilePage.fillProfileForm(data);
});

When('I click the save profile button', async function ({ page }) {
  if (!profilePage) {
    profilePage = new ProfilePage(page);
  }
  await profilePage.clickSaveProfile();
});

Then('I should see a success message {string}', async function ({ page }, message: string) {
  if (!profilePage) {
    profilePage = new ProfilePage(page);
  }
  const successMessage = await profilePage.getSuccessMessage();
  expect(successMessage).toContain(message);
});

Then('the profile data should be saved in local storage', async function ({ page }) {
  const savedData = await page.evaluate(() => localStorage.getItem('profileData'));
  expect(savedData).not.toBeNull();
});

When('I fill the password form with current {string}, new {string}, and confirm {string}', async function ({ page }, current: string, newPass: string, confirm: string) {
  if (!profilePage) {
    profilePage = new ProfilePage(page);
  }
  await page.waitForTimeout(1500);
  await profilePage.fillPasswordForm({
    currentPassword: current,
    newPassword: newPass,
    confirmPassword: confirm
  });
  await page.waitForTimeout(2000);
});

When('I click the change password button', async function ({ page }) {
  if (!profilePage) {
    profilePage = new ProfilePage(page);
  }
  await profilePage.clickChangePassword();
  await page.waitForTimeout(1500);
});

Then('I should see a password success message {string}', async function ({ page }, message: string) {
  if (!profilePage) {
    profilePage = new ProfilePage(page);
  }
  const successMessage = await profilePage.getPasswordSuccessMessage();
  expect(successMessage).toContain(message);
});

Then('I should see a password error message {string}', async function ({ page }, message: string) {
  if (!profilePage) {
    profilePage = new ProfilePage(page);
  }
  const errorMessage = await profilePage.getPasswordErrorMessage();
  expect(errorMessage).toContain(message);
  await page.waitForTimeout(1500);
});

