import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { extractEmployeeList } from "../../utils/endpoints/classes/general/commonMethod";

import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("Work From Home Hybrid Request API", () => {
  let authToken, response;

  test.beforeEach(async ({ request }) => {
    // Login to get authentication token
    const loginPage = new LoginPage();
    const loginBody = {
      username: loginExpected.happy.loginName,
         password: loginExpected.happy.password,
    };
    const loginResponse = await loginPage.loginAs(request, loginBody);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTruthy();
    authToken = loginResponse.body.token;
  });

  test("Get Employee list - Happy flow @happy   ", async ({ request }) => {
    const attendance = new Attandance();
    response = await attendance.getEmployeeList(request, authToken);
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    // Validate each designation object
    const ids = new Set();
    for (const item of response.body) {
      expect(item).toHaveProperty("employeeCode");
      expect(item).toHaveProperty("employeeId");
      expect(item).toHaveProperty("departmentId");
      expect(item).toHaveProperty("designationName");
      expect(item).toHaveProperty("designationId");
      expect(item).toHaveProperty("companyId");
      expect(item).toHaveProperty("activeStatus");
      expect(item.activeStatus).toBe("AC");
      expect(item).toHaveProperty("fullNameCodeVaues");
    }

    const allEmployeeList = extractEmployeeList(response.body);
   
  });
});
