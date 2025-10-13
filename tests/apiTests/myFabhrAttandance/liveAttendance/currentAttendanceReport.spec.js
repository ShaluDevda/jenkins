import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import { liveAttendance } from "../../../utils/endpoints/classes/Attandance/liveAttendance.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };
import inputs from "../../../fixtures/inputs.json" assert { type: "json" };
let response;
test.describe("Time & Attendance>Attendance get Attendane Log", () => {
  let authToken;

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
  test("POST get Attendane Log - Happy flow @happy", async ({ request }) => {
    const LiveAttendance = new liveAttendance();

    response = await LiveAttendance.currentAttendanceReport(
      request,
      inputs.tenantId,
      authToken
    );
    expect(response.status).toBe(200);
  });
});
