import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import { extractDepartmentList } from "../../utils/endpoints/classes/general/commonMethod.js";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse.js";
import { Organization } from "../../utils/endpoints/classes/settings/Organization.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };


test.describe("GET| /hrmsApi/department/active/1, get find grade List", () => {
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

  test("Get department list - Happy flow @happy", async ({ request }) => {
    const organization = new Organization();
    response = await organization.getDepartmentList(request, authToken);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    // Validate each designation object
    const ids = new Set();
    for (const item of response.body) {
      expect(item).toHaveProperty("departmentId");
      expect(item).toHaveProperty("departmentName");
      expect(item).toHaveProperty("departmentCode");
      expect(item).toHaveProperty("userId");
      expect(item).toHaveProperty("dateCreated");
      expect(item).toHaveProperty("companyId");
      expect(item).toHaveProperty("userIdUpdate");
      expect(item).toHaveProperty("activeStatus");
      expect(item).toHaveProperty("businessUnitId");
      expect(item).toHaveProperty("selectedBusinessUnits");
     expect(item).toHaveProperty("companyId");
    }

    const gradeList = extractDepartmentList(response.body);
   
  });

   test("Get department list without tenantId - @negative", async ({ request }) => {
    const organization = new Organization();
    response = await organization.getDepartmentListWithoutTanantIdAndUserName(request, authToken);
    ExpectResponse.invalidAccess(response.body.message);
    // Validate each designation object
   ExpectResponse.forbiddenRequest(response.status);
   
  });

});



