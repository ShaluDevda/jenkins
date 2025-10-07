import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { extractBranchList } from "../../utils/endpoints/classes/general/commonMethod";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse";
import { Organization } from "../../utils/endpoints/classes/settings/Organization";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };


test.describe("GET| /hrmsApi/branch/findAll/1, get find branch List", () => {
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

  test("Get branch list - Happy flow @happy", async ({ request }) => {
    const organization = new Organization();
    response = await organization.getFindBranchList(request, authToken);
    expect(response).toBeTruthy();


    if (response.status === 500) {
      // Assert for no branch data present
      expect(response.body).toMatchObject({
        statusCode: 500,
        message: "Branch data not present",
        data: null,
        isSuccess: false,
        errorCode: null,
        errorMsg: null
      });
    } else if (response.status === 200) {
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Validate each designation object
      const ids = new Set();
      for (const item of response.body) {
        expect(item).toHaveProperty("branchId");
        expect(item).toHaveProperty("branchName");
        expect(item).toHaveProperty("address");
        expect(item).toHaveProperty("userId");
        expect(item).toHaveProperty("dateCreated");
        expect(item).toHaveProperty("companyId");
        expect(item).toHaveProperty("userIdUpdate");
        expect(item).toHaveProperty("activeStatus");
        expect(item).toHaveProperty("branchDto");
      }

      const gradeList = extractBranchList(response.body);
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }


    const BranchList = extractBranchList(response.body);

  });

  test("Get branch list without tenantId - @negative", async ({ request }) => {
    const organization = new Organization();
    response = await organization.getFindBranchListWithoutTanantIdAndUserName(request, authToken);
    ExpectResponse.invalidAccess(response.body.message);
    // Validate each designation object
    ExpectResponse.forbiddenRequest(response.status);

  });

});
