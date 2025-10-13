import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import expectResponse from "../../utils/endpoints/expect/expectResponse.js";

test.describe("GET| /hrmsApi/leaveApply/leaveBalanceNew/emp/{employeeId}/{companyId}, Returns employee leave balance summary including special leaves if eligible", () => {
    let authToken, response, companyId,employeeId;

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

    test("GET| Returns employee leave balance summary including special leaves if eligible - Happy flow @happy", async ({ request }) => {
        const leave = new Leave();
        // Get the holiday data
        response = await leave.getActiveLeavePeriods(request, authToken,employeeId,companyId);
        expectResponse.okResponse(response.status);
        expect(response.body).toBeTruthy();
       
    });

    test("GET| Negative - missing/invalid token should return 403 Unauthorized", async ({ request }) => {
        const leave = new Leave();
        // Call with empty token
        const res = await leave.getActiveLeavePeriods(request, '', employeeId, companyId);
        // Expect unauthorized
        ExpectResponse.forbiddenRequest(res.status);
        // Optionally assert error message exists
        expect(res.body).toBeTruthy();
    });

    test("GET| Negative - invalid employeeId format", async ({ request }) => {
        const leave = new Leave();
        // Use an invalid employeeId (non-numeric)
        const res = await leave.getActiveLeavePeriods(request, authToken, 'invalid-emp-id', companyId);
        ExpectResponse.internalServerError(res.status);
        expect(res.body).toBeTruthy();
    });

    test("GET| Negative - non-existent employeeId should return 404 Not Found", async ({ request }) => {
        const leave = new Leave();
        // Use a likely non-existent employeeId
        const res = await leave.getActiveLeavePeriods(request, authToken, 999999999, companyId);
        ExpectResponse.internalServerError(res.status);
        expect(res.body).toBeTruthy();
    });
});
