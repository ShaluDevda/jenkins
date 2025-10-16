import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse";
import { Organization } from "../../utils/endpoints/classes/settings/Organization";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };


test.describe("POST| /hrmsApi/branch, Create Branch", () => {
  let authToken, response,companyId, userId, userIdUpdate;

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
    companyId = loginResponse.body.companyId;
    userId = loginResponse.body.userId;
    userIdUpdate = loginResponse.body.userIdUpdate;
  });

  test("Create Branch - Happy flow @happy", async ({ request }) => {
    // Step 1: Create a unique branch name to avoid conflicts
    const uniqueBranchName = `testBranch_${Date.now()}`;
    const createBranchPayload = { 
      "branchName": uniqueBranchName, 
      "addressText": "Plot no. 91, Ratna Lok Colony,near medanta hospital, Indore, Madhya Pradesh 452011", 
      "pincode": "452011", 
      "countryId": "1", 
      "stateId": "1", 
      "cityId": "2", 
      "companyId": companyId, 
      "address": { 
        "addressText": "Plot no. 91, Ratna Lok Colony,near medanta hospital, Indore, Madhya Pradesh 452011", 
        "countryId": "1", 
        "stateId": "1", 
        "cityId": "2", 
        "pincode": "452011", 
        "userId": userId 
      }, 
      "activeStatus": "AC", 
      "userIdUpdate": userIdUpdate, 
      "userId": userId 
    };

    const organization = new Organization();
    
    // Step 2: Create the branch
    response = await organization.createBranch(request, authToken, createBranchPayload);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
   
    // Step 3: Get the branch list to verify the created branch
    response = await organization.getFindBranchList(request, authToken, companyId);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    
    // Step 4: Assert that the branch list contains our newly created branch
    expect(Array.isArray(response.body)).toBe(true);
    
    // Find the created branch in the list
    const createdBranch = response.body.find(branch => branch.branchName === uniqueBranchName);
    expect(createdBranch).toBeTruthy();
    expect(createdBranch.branchName).toBe(uniqueBranchName);
    expect(createdBranch.activeStatus).toBe("AC");
    expect(createdBranch.companyId).toBe(parseInt(companyId));
    
    // Step 5: Additional assertions to verify branch list contains the created branch name
    const branchNames = response.body.map(branch => branch.branchName);
    expect(branchNames).toContain(uniqueBranchName);
   
  });

});
