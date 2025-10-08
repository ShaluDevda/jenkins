import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };
import SettingLeave from "../../../fixtures/payloads/settingsLeave.json" assert { type: "json" };

// simple in-process counter that cycles 1..100
let __leavePeriodCounter = 0;


test.describe("POST| /hrmsApi/leaveScheme, Create leave scheme", () => {
    let authToken, response, loginResponse;
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
    });

    test("Create leave scheme - Happy flow @happy ", async ({ request }) => {
        // cycle counter 1..100
        __leavePeriodCounter += 1;
        if (__leavePeriodCounter > 100) __leavePeriodCounter = 1;
        const leavePeriodIdValue = __leavePeriodCounter;

        let payload = {
            ...SettingLeave.createleaveScheme,
            userIdUpdate: loginResponse.body.userIdUpadate,
            userId: loginResponse.body.userId,
            companyId: loginResponse.body.companyId,
            leavePeriodId: leavePeriodIdValue,
            dateCreated: new Date().toISOString(),
        }
        const leave = new Leave();
        response = await leave.createLeaveScheme(request, authToken, payload);
        console.log("create", response)
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
        //validate the created leave scheme
        response = await leave.getfindAllLeaveScheme(request, authToken, leavePeriodIdValue);
        console.log('findAll response', response.body)
        expect(response).toBeTruthy();
        ExpectResponse.okResponse(response.status);

        // ensure the created scheme is present in the list (match by name, value and leavePeriodId)
        const created = Array.isArray(response.body) && response.body.find(item =>
            item.leaveSchemeName === payload.leaveSchemeName &&
            Number(item.value) === Number(payload.value) &&
            Number(item.leavePeriodId) === Number(payload.leavePeriodId)
        );
        expect(created).toBeTruthy();

    });
});
