import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };


test.describe("POST| eaveScheme/findAll/{leavePeriodId}, getfindAllLeaveScheme", () => {
    let authToken, response, loginResponse, leavePeriodId,companyId;
    const leave = new Leave();
    test.beforeEach(async ({ request }) => {
        // Login to get authentication token
        const loginPage = new LoginPage();
        const loginBody = {
            username: loginExpected.happy.loginName,
            password: loginExpected.happy.password,
        };
        loginResponse = await loginPage.loginAs(request, loginBody);

        ExpectResponse.okResponse(loginResponse.status);
        expect(loginResponse.body.token).toBeTruthy();
        authToken = loginResponse.body.token;
        companyId = loginResponse.body.companyId;
        response = await leave.getLeavePeriodstatus(request, authToken, companyId);
        leavePeriodId = response.body[0].leavePeriodId;
    });

    test("Create leave scheme - Happy flow @happy ", async ({ request }) => {

        response = await leave.getfindAllLeaveScheme(request, authToken, leavePeriodId);
        expect(response).toBeTruthy();
        ExpectResponse.okResponse(response.status);
        // Validate expected leave scheme is present in response
        // Assert that at least one object contains the required keys (values not asserted)
        const expectedKeys = {
            leaveSchemeId: expect.anything(),
            dateCreated: expect.anything(),
            dateUpdates: expect.anything(),
            leaveSchemeName: expect.anything(),
            userId: expect.anything(),
            userIdUpdate: expect.anything(),
            leavePeriodId: expect.anything(),
            status: expect.anything(),
            value: expect.anything(),
            companyId: expect.anything(),
            leaveSchemeMasterDto: expect.anything()
        };

        // ensure the response array contains at least one object with the required keys (values ignored, null allowed)
        const requiredKeys = [
            'leaveSchemeId',
            'dateCreated',
            'dateUpdates',
            'leaveSchemeName',
            'userId',
            'userIdUpdate',
            'leavePeriodId',
            'status',
            'value',
            'companyId',
            'leaveSchemeMasterDto'
        ];

        const contains = Array.isArray(response.body) && response.body.some(item =>
            requiredKeys.every(k => Object.prototype.hasOwnProperty.call(item, k))
        );

        expect(contains).toBeTruthy();

    });
});
