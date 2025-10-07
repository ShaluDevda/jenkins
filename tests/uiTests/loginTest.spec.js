import { test, expect } from '@playwright/test';
import { LoginPage }    from '../Pages/loginPage';

test.describe('Login', () => {
  test.describe.configure({ timeout: 80_000 });

  let loginPage;

  test.beforeEach(async ({ page }) => {
     loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  
  test('Login with valid username and password @happy', { timeout: 80000 }, async ({ page }) => {
   await loginPage.login('FABHR-537-fabhrdemo.in', '12345678');

   
    // Prefer a robust text locator; keep original XPath as fallback
    const dashboardByText = page.getByText('Dashboard', { exact: true });
    const dashboard = page.locator('//span[normalize-space()="Dashboard"]');

    // Wait and assert visibility with a higher timeout for slower envs
    await expect(dashboardByText.or(dashboard)).toBeVisible({ timeout: 15000 });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  const negativeCases = [
    {
      user: 'T-10',
      pass: '123',
      // your “incorrect username” banner lives in this <p>
      selector: "//p[@class='loginError login-errorT']",
      expected: 'You have entered incorrect username.'
    },
    {
      user: 'T-10',
      pass: '12345678',
      selector: "//p[@class='loginError login-errorT']",
      expected: 'You have entered incorrect username.'
    },
    // {
    //   user: 'FABHR-72-fabhrdemo.in',
    //   pass: '0',
    //   selector: "//p[@class='loginError login-errorT']",
    //   // dynamic password-attempt message
    //   expectedRegex:  /^\s*(?:Incorrect password .* \d+ unsuccessful attempt's out of 5 allowed attempts\.|Error! User Blocked)\s*$/,

    //     },
  ];

  test.describe('Negative login @negative', () => {
    for (const { user, pass, selector, expected, expectedRegex } of negativeCases) {
      test(`login(${user}, ${pass}) shows error`, async ({ page }) => {
        await loginPage.login(user, pass);

        const banner = page.locator(selector);
        // wait for that particular banner to appear
        await banner.waitFor({ state: 'visible', timeout: 5_000 });

        if (expectedRegex) {
          await expect(banner).toHaveText(expectedRegex);
        } else {
          await expect(banner).toContainText(expected);
        }
      });
    }
  });
});