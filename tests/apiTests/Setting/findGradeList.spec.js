import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { extractGradeList } from "../../utils/endpoints/classes/general/commonMethod";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse";
import { Organization } from "../../utils/endpoints/classes/settings/Organization";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };


test.describe("GET| /hrmsApi/grade/findGradeList/1, get find grade List", () => {
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

  test("Get Branch list - Happy flow @happy", async ({ request }) => {
    const organization = new Organization();
    response = await organization.getFindGradeList(request, authToken);
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    // Validate each designation object
    const ids = new Set();
    for (const item of response.body) {
      expect(item).toHaveProperty("gradesId");
      expect(item).toHaveProperty("gradesName");
      expect(item).toHaveProperty("salaryFrom");
      expect(item).toHaveProperty("salaryTo");
      expect(item).toHaveProperty("incrementPer");
      expect(item).toHaveProperty("userId");
      expect(item).toHaveProperty("dateCreated");
      expect(item).toHaveProperty("activeStatus");
      expect(item).toHaveProperty("userIdUpdate");
      expect(item).toHaveProperty("gradesPayDefinitions");
     expect(item).toHaveProperty("companyId");
    }

    const gradeList = extractGradeList(response.body);
   
  });

   test("Get Grade list without tenantId - @negative", async ({ request }) => {
    const organization = new Organization();
    response = await organization.getFindGradeListWithoutTanantIdAndUserName(request, authToken);
    ExpectResponse.invalidAccess(response.body.message);
    // Validate each designation object
   ExpectResponse.forbiddenRequest(response.status);
   
  });

});
