# HALO - Test Automation Framework Challenge for Halo

A test automation solution built with Playwright and BDD for the HALO web application. The suite covers authentication, navigation, product management, and user profile workflows.

The application under test is a web-based management dashboard. It has a login page, a dashboard with statistics, a products page where items can be added and deleted, and a profile page where users can update their personal details and change their password. All of that is covered by the tests in this project.

---

## Requirements

Before running anything, make sure you have these installed:

- **Node.js** v16 or higher , https://nodejs.org
- **npm** , comes bundled with Node.js

To verify your versions:
```bash
node --version
npm --version
```

If Node.js is not installed, download the LTS version from the link above. The installer takes care of everything including npm.

---

## Installation

Clone or download the project, open a terminal inside the project folder, and run:

```bash
npm install
```

This installs all dependencies including Playwright and its browser binaries. It only needs to be done once. The first run may take a couple of minutes because it downloads Chromium.

---

## Running the Tests

The web server starts automatically when tests run , you do not need to start it manually.

**Headless (no browser window, fastest):**
```bash
npm test
```

**With the browser visible , recommended for demos:**
```bash
npm run test:headed
```

**Interactive UI , pick and run individual tests:**
```bash
npm run test:ui
```

**Debug mode , steps through each action one at a time:**
```bash
npm run test:debug
```

**Windows shortcut , double-click this file in Explorer:**
```
RUN-SHOWCASE.bat
```

---

## What Happens When Tests Run

When you run in headed mode, you will see the browser open and the test automation controlling it directly. Actions are deliberately slowed down to 500ms so each interaction is visible , fields being filled, buttons being clicked, pages loading.

On top of that, three overlays appear in the browser window during execution:

- **Top right** , a breadcrumb trail showing each step as it completes
- **Bottom left** , a performance panel showing load time, DOM ready time, and network request counts
- **Top left** , a network activity indicator that updates as requests happen

Elements also get a brief green outline when they are interacted with, so it is easy to follow what the test is doing at any point.

---

## Viewing Results

An HTML report opens automatically after each run. To open it manually:

```bash
npm run test:report
```

Reports are saved to `playwright-report/index.html`. They show each test with its steps, duration, and status. If a test fails, the report includes a screenshot of the browser at the point of failure, a video recording of the full run, and a trace file you can open to replay every action step by step.

To clean up old results before a fresh run:
```bash
npm run clean
```

---

## Project Structure

```
halo/
├── tests/
│   ├── features/
│   │   └── complete-application-tests.feature   # All test scenarios in plain English
│   ├── steps/                                    # Step definitions (Gherkin to Playwright)
│   │   ├── authenticationSteps.ts
│   │   ├── navigationSteps.ts
│   │   ├── productsSteps.ts
│   │   ├── profileSteps.ts
│   │   └── scrollSteps.ts
│   ├── pages/                                    # Page Object Models
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   ├── ProductsPage.ts
│   │   └── ProfilePage.ts
│   ├── helpers/                                  # Utility classes
│   │   ├── VisualHelper.ts
│   │   ├── PerformanceHelper.ts
│   │   ├── AccessibilityHelper.ts
│   │   ├── SmartLocator.ts
│   │   ├── TestDataGenerator.ts
│   │   ├── TestAnalytics.ts
│   │   └── ScrollHelper.ts
│   └── fixtures/
│       └── fixtures.ts
├── site/                                         # The web app under test
├── playwright-report/                            # Generated HTML reports
├── test-results/                                 # Screenshots and videos
├── playwright.config.ts                          # Playwright configuration
├── package.json
└── README.md
```

The `site/` folder contains the static HTML application. The built-in web server in `playwright.config.ts` serves it on `http://localhost:8080` automatically when tests start.

---

## Test Scenarios

All scenarios live in one feature file: `tests/features/complete-application-tests.feature`

| Scenario | What it covers |
|---|---|
| Complete User Journey | Login, dashboard stats, add a product, update profile, scroll, logout |
| Authentication Validation | Invalid credentials error, remember me checkbox, session persistence |
| Product Management | Add a product with form validation, search by name, delete |
| Profile Password Management | Mismatch error, short password error, successful change |

Each scenario is written in Gherkin (Given/When/Then), so they read like a plain English description of what the user does and what should happen. Non-technical stakeholders can read the feature file and understand exactly what is being tested without needing to read any code.

The `Background` block at the top of the feature file runs before every scenario , it clears cookies and local storage so each test starts from a clean state and does not depend on the results of the previous one.

---

## Technical Stack

| Tool | Purpose |
|---|---|
| Playwright | Browser automation , controls Chromium |
| TypeScript | All test code is typed, which catches mistakes early |
| playwright-bdd | Connects Gherkin feature files to Playwright test runner |
| Page Object Model | Each page has its own class with locators and methods |

The BDD layer (playwright-bdd) generates spec files from the feature file before tests run. These go into `.features-gen/` and are not meant to be edited. If something looks off with test discovery, deleting that folder and running again usually fixes it.

---

## Configuration

All settings are in `playwright.config.ts`. Current defaults:

- **Base URL:** `http://localhost:8080`
- **Browser:** Chromium
- **Headed:** true (browser is visible by default)
- **SlowMo:** 500ms , each action waits 500ms so the execution is watchable
- **Screenshots:** On failure only
- **Videos:** On failure only
- **Retries:** 0 , tests run once; if they fail, they fail so the issue is visible

To run headless (no browser window), use `npm test`. To see the browser, use `npm run test:headed`. The configuration does not need to be changed for normal use.

---

## Test Data

The tests use hardcoded credentials and product data. No external database or API is required.

- **Login:** username `testuser`, password `password123`
- **Product categories available:** electronics, clothing, books, food
- **Profile fields:** full name, email, phone, bio

All data is reset between scenarios via the `Background` step which clears localStorage before each run.

---

## Helper Classes

These utilities live in `tests/helpers/` and are used to make the tests more informative and resilient. They are not required for the tests to pass , they add value on top.

- **VisualHelper** , highlights elements with a coloured outline when they are interacted with, and adds timestamped breadcrumbs to the browser overlay so you can follow the test path in real time
- **PerformanceHelper** , measures page load time, DOM ready time, first paint, and network request counts, then displays them as an overlay during the test run and saves them to `test-results/performance-metrics.json`
- **SmartLocator** , when a selector fails, it tries alternative strategies (by role, by text, by placeholder, by test ID) before giving up, which helps tests survive minor UI changes
- **AccessibilityHelper** , runs WCAG checks on the current page and reports violations grouped by severity
- **ScrollHelper** , handles scroll operations and verifies element visibility after scrolling
- **TestAnalytics** , generates an HTML dashboard at `test-results/analytics-dashboard.html` after a run, with pass rate, duration charts, and a per-test breakdown
- **TestDataGenerator** , creates realistic randomised test data for names, emails, products, and prices when hardcoded values are not suitable

---

## Adding Tests

1. Open `tests/features/complete-application-tests.feature`
2. Add a new `Scenario:` block in Gherkin
3. If any steps are new, add them to the relevant file under `tests/steps/`
4. If the new steps need new page interactions, update the relevant class under `tests/pages/`
5. Run `npm test` to confirm everything works

New steps follow the same pattern as existing ones. Here is an example of how a step definition looks:

```typescript
When('I filter products by category {string}', async function ({ page }, category: string) {
  const productsPage = new ProductsPage(page);
  await productsPage.filterByCategory(category);
});
```

And the matching Gherkin line in the feature file:
```gherkin
When I filter products by category "electronics"
```

---

## Troubleshooting

**"No tests found" error**
The BDD layer generates spec files into `.features-gen/` before running. If that folder is missing or stale, delete it and run again:
```bash
Remove-Item -Recurse -Force .features-gen
npm test
```

**"Cannot find module" or TypeScript errors**
Run `npm install` again. If the problem persists, delete `node_modules/` and reinstall:
```bash
Remove-Item -Recurse -Force node_modules
npm install
```

**Tests fail on the first step**
The web server may not have started in time. This is rare but can happen on slower machines. Try increasing the `timeout` in `playwright.config.ts` under the `webServer` block.

**Browser opens but nothing happens**
Check the terminal , Playwright prints a clear error message pointing to the exact step that failed. Start there.

**Tests run but the browser is too fast to follow**
Increase `slowMo` in `playwright.config.ts`. Change `500` to `1000` or `2000`. The value is in milliseconds.

**Want to pause the test and inspect the browser manually**
Add this line anywhere inside a step definition:
```typescript
await page.pause();
```
Then run with `npm run test:debug`. The browser will freeze at that point and open Playwright Inspector so you can poke around.

---

## Architecture Notes

The project follows three clear layers that keep everything maintainable:

**1. Feature files** (`tests/features/`)
Written in Gherkin. Describe what the application should do from a user's perspective. Anyone on the team can read and understand these, no coding knowledge needed.

**2. Step definitions** (`tests/steps/`)
Each Gherkin line maps to a TypeScript function here. The functions are kept thin , they call Page Object methods rather than interacting with the page directly. This keeps step files readable and avoids duplication.

**3. Page objects** (`tests/pages/`)
One class per page of the application. Each class holds all the locators for that page and the methods to interact with them. If a button's selector changes in the app, you fix it in one place here and every test that uses it is automatically fixed.

This structure scales well. Adding a new page means creating one new class. Adding new scenarios means writing Gherkin steps and wiring them to existing or new page methods , the separation stays clean.

---

## Page Object Model in Practice

The Page Object Model is the core pattern keeping this project maintainable. Each page of the application gets its own class. That class owns all the selectors and all the actions for that page. Tests never reach into the DOM directly.

Here is what a page object looks like in this project:

```typescript
export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly addProductButton: Locator;
  readonly productNameInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.addProductButton = page.locator('[data-testid="add-product-button"]');
    this.productNameInput = page.locator('[data-testid="product-name-input"]');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForTimeout(500);
  }

  async clickAddProduct() {
    await this.addProductButton.click();
    await this.page.locator('#addProductModal').waitFor({ state: 'visible' });
  }
}
```

And a step definition that uses it:

```typescript
When('I search for {string}', async function ({ page }, term: string) {
  const productsPage = new ProductsPage(page);
  await productsPage.search(term);
});
```

The step definition does not know what the search input's selector is. It only knows that `ProductsPage` has a `search` method. This is the key benefit: when the app changes, you update the page object, not every test that happens to search for something.

### What good POM looks like

- One class per page or major component
- Locators defined as class properties in the constructor, not scattered through methods
- Methods describe what a user does, not what a selector is (`clickAddProduct` not `clickButtonWithIdAddBtn`)
- Methods handle waits internally so step definitions stay clean
- No assertions inside page objects, those belong in step definitions

---

## Anti-patterns and Why They Are Avoided

**Hardcoding selectors in step definitions**

When selectors are spread across step files, a single UI change forces you to hunt through every file to fix it.

```typescript
// Bad
When('I click add', async function ({ page }) {
  await page.locator('#add-btn-v2-final').click();
});

// Good
When('I click the add product button', async function ({ page }) {
  const productsPage = new ProductsPage(page);
  await productsPage.clickAddProduct();
});
```

**Sleeping instead of waiting**

`waitForTimeout` with large values makes tests slow and unreliable. Playwright has explicit wait mechanisms for elements and network activity. The small delays in this project exist only to keep headed runs watchable, not to paper over timing issues.

```typescript
// Bad
await page.waitForTimeout(5000);
await page.click('#submit');

// Good
await page.locator('#submit').waitFor({ state: 'visible' });
await page.locator('#submit').click();
```

**Testing multiple concerns in one step**

Steps that do many things produce error messages that tell you something went wrong, but not what. One step, one action.

```typescript
// Bad
When('I log in, go to products, and add one', async function ({ page }) { ... });

// Good, each step has a single responsibility
When('I login with username "x" and password "y"', ...);
Then('I should be redirected to the dashboard page', ...);
When('I click on the "Products" navigation link', ...);
```

**Shared state between scenarios**

Tests that depend on browser state left by a previous test break in non-obvious ways, especially in parallel runs. The `Background` block in this project clears cookies and localStorage before every scenario so each one starts clean.

```gherkin
Background:
  Given I clear all cookies and local storage
```

**Locating elements by text or position**

Selectors based on visible text or DOM position break when content changes or the layout shifts. This project uses `data-testid` attributes throughout, which are stable and intentional.

```typescript
// Fragile
page.locator('button:nth-child(2)')
page.locator('text=Click Here')

// Stable
page.locator('[data-testid="add-product-button"]')
```

