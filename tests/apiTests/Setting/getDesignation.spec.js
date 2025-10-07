import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import { extractDesignationList } from "../../utils/endpoints/classes/general/commonMethod.js";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse.js";
import { Organization } from "../../utils/endpoints/classes/settings/Organization.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("GET| /hrmsApi/designation/1, get  designation List", () => {
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

  test("Get designation list - Happy flow @happy", async ({
    request,
  }) => {
    const organization = new Organization();
    response = await organization.getDesignationList(request, authToken);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    // Validate each designation object
    const ids = new Set();
    for (const item of response.body) {
      expect(item).toHaveProperty("designationId");
      expect(item).toHaveProperty("activeStatus");
      expect(item).toHaveProperty("allowModi");
      expect(item).toHaveProperty("companyId");
      expect(item).toHaveProperty("dateCreated");
      expect(item).toHaveProperty("userIdUpdate");
      expect(item).toHaveProperty("departmentId");
      expect(item).toHaveProperty("designationName");
      expect(item).toHaveProperty("departmentName");
      expect(item).toHaveProperty("effectiveEndDate");
      expect(item).toHaveProperty("effectiveStartDate");
      expect(item).toHaveProperty("groupId");
      expect(item).toHaveProperty("userId");
      expect(item).toHaveProperty("userIdUpdate");

      expect(item).toHaveProperty("deptDesignationMapping");
      expect(item).toHaveProperty("department");
    }

    const gradeList = extractDesignationList(response.body);
  });

  test("Get designation list without tenantId - @negative", async ({
    request,
  }) => {
    const organization = new Organization();
    response = await organization.getDesignationListWithoutTanantIdAndUserName(
      request,
      authToken
    );
    ExpectResponse.invalidAccess(response.body.message);
    // Validate each designation object
    ExpectResponse.forbiddenRequest(response.status);
  });
});
