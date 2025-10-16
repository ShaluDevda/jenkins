import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("GET| /hrmsApi/leaveApply/leaveBalance/emp/{employeeId}/{companyId}}, Fetch employee leave balance summary", () => {
    let authToken, response, employeeId, companyId;

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
        employeeId = loginResponse.body.employeeId;
        companyId = loginResponse.body.companyId;
    });

    test("Fetch employee leave balance summary - Happy flow @happy", async ({ request }) => {
        const leave = new Leave();
        response = await leave.getEmployeeLeaveBalanceSummryList(request, authToken, employeeId, companyId);
        expect(response).toBeTruthy();
        ExpectResponse.okResponse(response.status);
    });
});
