import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import { Attandance } from "../../../utils/endpoints/classes/Attandance/myAttandance.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("GET | Time & Attendance>Attendance>Push Machine Attendance on Cloud, get unsuccessSyncAttendance", () => {
  let authToken, loginPage, attendance;

  test.beforeEach(async ({ request }) => {
    // Login to get authentication token
     loginPage = new LoginPage();
    const loginBody = {
      username: loginExpected.happy.loginName,
         password: loginExpected.happy.password,
    };
    const loginResponse = await loginPage.loginAs(request, loginBody);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTruthy();
    authToken = loginResponse.body.token;
  });

  test("get unsuccessSyncAttendance @happy   ", async ({ request }) => {
     attendance = new Attandance();
    const response = await attendance.unsuccessSyncAttendance(
      request,
      authToken
    );
    expect(response).toBeTruthy();
    expect(response.body).toBe(Array.isArray(response.body) ? response.body : []);
    expect(response.status).toBe(200);
  });
});

