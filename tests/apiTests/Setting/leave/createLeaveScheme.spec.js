import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };
import SettingLeave from "../../../fixtures/payloads/settingsLeave.json" assert { type: "json" };


test.describe("POST| /hrmsApi//hrmsApi/leaveScheme, Create leave scheme", () => {
    let authToken, response;
    let payload = {
        ...SettingLeave.createleaveScheme,
        userIdUpdate: loginExpected.happy.userId,
        dateCreated: new Date().toISOString(),


    }

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

    test("Create leave scheme - Happy flow @happy ", async ({ request }) => {
        const leave = new Leave();
        response = await leave.createLeaveScheme(request, authToken, payload);
       
        expect(response).toBeTruthy();
        ExpectResponse.okResponse(response.status);
        expect(response.body).toEqual(expect.objectContaining({
            leaveSchemeName: payload.leaveSchemeName,
            value: payload.value,
            userId: payload.userId,
            userIdUpdate: payload.userIdUpdate,
            status: payload.status,
            leavePeriodId: payload.leavePeriodId,
            // companyId: payload.companyId
        }));
        
    });
});
