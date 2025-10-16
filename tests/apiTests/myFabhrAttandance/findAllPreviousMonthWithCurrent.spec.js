import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("GET| -/hrmsApi/findAllPreviousMonth/{companyId} ,Time & Attendance>Attendance findAllPreviousMonthWithCurrent", () => {
  let authToken,companyId;

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
    companyId = loginResponse.body.companyId
  });

  test("GET findAllPreviousMonthWithCurrent @happy", async ({ request }) => {
    const attendance = new Attandance();
    const response = await attendance.findAllPreviousMonthWithCurrent(
      request,
      authToken,
      companyId
    );
    
    expect(response.status).toBe(200);
  });
});

