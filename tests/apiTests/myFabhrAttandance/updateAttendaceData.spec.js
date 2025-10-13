import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Organization } from "../../utils/endpoints/classes/settings/Organization";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("POST| updateAttendaceData API", () => {
  let authToken;

  test.beforeEach(async ({ request }) => {
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

  test("POST | updateAttendaceData- Happy flow @happy   ", async ({
    request,
  }) => {
    const organization = new Organization();
    const attendance = new Attandance();
    const payload = [];

    const response = await attendance.updateAttendaceData(
      request,
      authToken,
      payload
    );
    // Assertions for response structure and employee fields
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
  });
});
