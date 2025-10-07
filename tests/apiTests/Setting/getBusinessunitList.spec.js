import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import { extractBusinessunitList } from "../../utils/endpoints/classes/general/commonMethod.js";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse.js";
import { Organization } from "../../utils/endpoints/classes/settings/Organization.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("GET| /hrmsApi/businessunit/1, get businessunit List", () => {
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

  test("Get businessunit list - Happy flow @happy", async ({
    request,
  }) => {
    const organization = new Organization();
    response = await organization.getBusinessunitList(request, authToken);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    // Validate each designation object
    const ids = new Set();
    for (const item of response.body) {
      expect(item).toHaveProperty("businessUnitId");
      expect(item).toHaveProperty("businessUnitCode");
      expect(item).toHaveProperty("businessUnitName");
    }

    const gradeList = extractBusinessunitList(response.body);
  });

  test("Get businessunit list without tenantId - @negative", async ({
    request,
  }) => {
    const organization = new Organization();
    response = await organization.getBusinessunitListWithoutTanantIdAndUserName(
      request,
      authToken
    );
    ExpectResponse.invalidAccess(response.body.message);
    // Validate each designation object
    ExpectResponse.forbiddenRequest(response.status);
  });
});
