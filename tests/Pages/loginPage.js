// pages/loginPage.js

class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page 
     * @param {string} 
     */
    constructor(page) {
      this.page = page;
      this.usernameInput = page.locator('input[placeholder="Username"]');
      this.passwordInput = page.locator('input[placeholder="Password"]');
      this.loginButton = page.getByRole('button', { name: 'Log in' });
    }
  
    async goto() {
        await this.page.goto("https://hrms.fabhr.in/hrms/#/");
    }
  
    async login(username, password) {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    }
  }
  
  module.exports = { LoginPage };
  