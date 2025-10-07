import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("POST| /hrmsApi/employee/employeeInfo/emp/1,Get employeeInfo", () => {
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

    test("Get employeeInfo - Happy flow @happy", async ({ request }) => {
        const leave = new Leave();
        response = await leave.getemployeeInfo(request, authToken);
     
        expect(response).toBeTruthy();
        ExpectResponse.okResponse(response.status);
        ExpectResponse.successfullyDataFound(response.body.message);
        expect(response.body.isSuccess).toBe(true);
    });
});
