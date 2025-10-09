import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse";
import { Organization } from "../../utils/endpoints/classes/settings/Organization";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };


test.describe("POST| /hrmsApi/branch, Create Branch", () => {
  let authToken, response, responsebody;

  test.beforeEach(async ({ request }) => {
    // Login to get authentication token
    const loginPage = new LoginPage();
    const loginBody = {
      username: loginExpected.happy.loginName,
      password: loginExpected.happy.password,
    };
    const loginResponse = await loginPage.loginAs(request, loginBody);
    ExpectResponse.okResponse(loginResponse.status);
    expect(loginResponse.body.token).toBeTruthy();
    authToken = loginResponse.body.token;
  });

  test("Create Branch  - Happy flow @happy ", async ({ request }) => {
    const payload = { "branchName": "testCompany", "addressText": "Plot no. 91, Ratna Lok Colony,near medanta hospital, Indore, Madhya Pradesh 452011", "pincode": "452011", "countryId": "1", "stateId": "1", "cityId": "2", "companyId": 1, "address": { "addressText": "Plot no. 91, Ratna Lok Colony,near medanta hospital, Indore, Madhya Pradesh 452011", "countryId": "1", "stateId": "1", "cityId": "2", "pincode": "452011", "userId": 2 }, "activeStatus": "AC", "userIdUpdate": 2, "userId": 2 }
    const organization = new Organization();
    response = await organization.createBranch(request, authToken, payload);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);

    // Validate after creating branch
    response = await organization.getFindBranchList(request, authToken);
    console.log(response)
    responsebody = response.body[0];
    let newStatus = responsebody.activeStatus === 'AC' ? 'DE' : 'AC';
    //active and deactive branch
    const payload1 = {
      ...responsebody,
      activeStatus: newStatus
    }

    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    // Verify the created branch name is present in the response
    const branchList = response.body?.data || response.body; // adjust if your API structure differs
    const branchNames = branchList.map(branch => branch.branchName);
    expect(branchNames).toContain(payload.branchName);

  });

});
