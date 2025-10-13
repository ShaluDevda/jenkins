import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
let response;
test.describe("Time & Attendance>Attendance get attendanceReport ", () => {
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
  test("GET get attendanceReport  - Happy flow  @happy", async ({ request }) => {
    const attendance = new Attandance();

    // Call the method that returns the Playwright APIResponse object
    response = await attendance.getattendanceReport(request, authToken);

    // Check status
    expect(response.status).toBe(200);

    let contentType;
    if (typeof response.headers === "function") {
      contentType = response.headers()["content-type"];
    } else {
      contentType = response.headers["content-type"];
    }
    expect(contentType).toMatch(/(octet-stream|excel|spreadsheetml\.sheet)/i);
  });
});
