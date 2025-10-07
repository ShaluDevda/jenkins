import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse";
import { Organization } from "../../utils/endpoints/classes/settings/Organization";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };


test.describe("DELETE| /hrmsApi/branch/delete/{branchId}, Delete Branch", () => {
    let authToken, response;

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

    test("Delete Branch  - Happy flow @happy", async ({ request }) => {
        const organization = new Organization();
        response = await organization.getFindBranchList(request, authToken);
        if (response.body.message == 'Branch data not present') {
            const payload = { "branchName": "testCompany", "addressText": "Plot no. 91, Ratna Lok Colony,near medanta hospital, Indore, Madhya Pradesh 452011", "pincode": "452011", "countryId": "1", "stateId": "1", "cityId": "2", "companyId": 1, "address": { "addressText": "Plot no. 91, Ratna Lok Colony,near medanta hospital, Indore, Madhya Pradesh 452011", "countryId": "1", "stateId": "1", "cityId": "2", "pincode": "452011", "userId": 2 }, "activeStatus": "AC", "userIdUpdate": 2, "userId": 2 }
            response = await organization.createBranch(request, authToken, payload);
            ExpectResponse.okResponse(response.status);
            response = await organization.getFindBranchList(request, authToken);
            expect(response).toBeTruthy();
        }

        // Get the branchId and branchName of the first branch
        const branchId = response.body[0].branchId;
        console.log('Branch ID to be deleted:', branchId);
        // Delete the branch
        response = await organization.deleteBranch(request, authToken, branchId);
        expect(response).toBeTruthy();
        ExpectResponse.okResponse(response.status);
        // After delete, validate the branch is not in the list
        response = await organization.getFindBranchList(request, authToken);
        // Check that the deleted branch name is not present
        const branchList = response.body;
        // If no branch data after deletion, validate response structure
        if (response.status === 500 && response.body && response.body.message === 'Branch data not present') {
            expect(response.body).toEqual({
                statusCode: 500,
                message: 'Branch data not present',
                data: null,
                isSuccess: false,
                errorCode: null,
                errorMsg: null
            });
        } else {
            // Otherwise, check that the deleted branch id is not present
            const branchIdValidation = branchList.map(branch => branch.branchId);
            expect(branchIdValidation).not.toContain(branchId);
        }
    });


});
