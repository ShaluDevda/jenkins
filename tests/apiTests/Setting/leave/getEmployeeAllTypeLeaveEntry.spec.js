import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("POST| /hrmsApi/leaveApply/employeeAllTypeLeaveEntry/emp/{employeeId}/{companyId}, Get EmployeeAllTypeLeaveEntry", () => {
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

    test("Get EmployeeAllTypeLeaveEntry - Happy flow @happy", async ({ request }) => {
        const leave = new Leave();
        response = await leave.getEmployeeAllTypeLeaveEntry(request, authToken, employeeId, companyId);
        console.log(response)
        expect(response).toBeTruthy();
        ExpectResponse.okResponse(response.status);
    });
});
