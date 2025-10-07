import { test, expect } from "@playwright/test";
import { LoginPage } from "../utils/endpoints/classes/login.js";
import loginExpected from "../fixtures/Response/loginExpected.json" assert { type: "json" };

// Reusable login body template
const defaultLoginBody = {
  username: loginExpected.happy.loginName,
     password: loginExpected.happy.password,
};

test.describe('POST | -/hrmsApi/login Login API Tests', () => {
  let loginPage;

  test.beforeEach(() => {
    loginPage = new LoginPage();
  });

  test("POST | Login with valid credentials @happy", async ({ request }) => {
    const response = await loginPage.loginAs(request, defaultLoginBody);
    
    // Ensure response body is properly parsed
    const body = response.body;

    // Validate response status
    expect(response.status).toBe(loginExpected.happy.status);

    // Validate token
    expect(body).toHaveProperty("token");
    expect(body.token).toBeTruthy();

    // Validate user details
    expect(body).toMatchObject({
      message: loginExpected.happy.message,
      employeeCode: loginExpected.happy.employeeCode,
      userId: loginExpected.happy.userId,
      employeeId: loginExpected.happy.employeeId,
      loginName: loginExpected.happy.loginName
    });

    // Validate roles
    expect(body.roles).toContain(loginExpected.happy.roles[0]);
  });

  // Negative test cases
  const negativeCases = loginExpected.negative.map((item) => ({
    ...item,
    expectedRegex: item.expectedRegex ? new RegExp(item.expectedRegex) : undefined
  }));

  for (const testCase of negativeCases) {
    const { username, password, status, expected, expectedRegex } = testCase;
    
    test(`POST | Login fails with ${username || 'empty username'} - ${password || 'empty password'} @negative`, 
    async ({ request }) => {
      const testLoginBody = { 
        ...defaultLoginBody, 
        username, 
        password 
      };

      const response = await loginPage.loginAs(request, testLoginBody);

      // Validate status code
      expect(response.status).toBe(status);

      // Validate error message
      if (expectedRegex) {
        expect(response.body.message).toMatch(expectedRegex);
      } else {
        expect(response.body.message).toContain(expected);
      }
    });
  }
});
