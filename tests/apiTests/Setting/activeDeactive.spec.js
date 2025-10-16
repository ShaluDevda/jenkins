import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse";
import { Organization } from "../../utils/endpoints/classes/settings/Organization";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };


test.describe("POST| /hrmsApi/branch, Create Branch and Test Active/Deactive", () => {
  let authToken, response, companyId, userId, userIdUpdate;

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

  test("Create Branch and Test Active/Deactive - Happy flow @happy ", async ({ request }) => {
    // Step 1: Create a new branch with unique name (timestamp-based)
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
    
    // Create the branch
    response = await organization.createBranch(request, authToken, createBranchPayload);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);

    // Step 2: Get branch list and find the newly created branch
    response = await organization.getFindBranchList(request, authToken, companyId);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    
    // Find the newly created branch in the list
    const createdBranch = response.body.find(branch => branch.branchName === uniqueBranchName);
    expect(createdBranch).toBeTruthy();
    expect(createdBranch.branchName).toBe(uniqueBranchName);
    expect(createdBranch.activeStatus).toBe("AC"); // Should be active initially

    // Step 3: Test deactivation - change status from AC to DE
    let deactivatePayload = {
      ...createdBranch,
      activeStatus: "DE" // Change from AC to DE
    };
    
    response = await organization.createBranch(request, authToken, deactivatePayload);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    
    // Verify the branch is now deactivated
    response = await organization.getFindBranchList(request, authToken, companyId);
    const deactivatedBranch = response.body.find(branch => branch.branchId === createdBranch.branchId);
    expect(deactivatedBranch.activeStatus).toBe("DE");

    // Step 4: Test reactivation - change status from DE to AC
    let reactivatePayload = {
      ...deactivatedBranch,
      activeStatus: "AC" // Change from DE back to AC
    };
    
    response = await organization.createBranch(request, authToken, reactivatePayload);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    
    // Final verification - branch should be active again
    response = await organization.getFindBranchList(request, authToken, companyId);
    const reactivatedBranch = response.body.find(branch => branch.branchId === createdBranch.branchId);
    expect(reactivatedBranch.activeStatus).toBe("AC");
    
    // Verify the branch name is still present in the response
    const branchNames = response.body.map(branch => branch.branchName);
    expect(branchNames).toContain(uniqueBranchName);

  });

});
