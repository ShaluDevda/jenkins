import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };
import SettingLeave from "../../../fixtures/payloads/settingsLeave.json" assert { type: "json" };

test.describe("POST| /hrmsApi/holidays, Active Deactive holiday", () => {
    let authToken, response, holiday, companyId, payload, leavePeriodId;
    const leave = new Leave();
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
        response = await leave.getLeavePeriodstatus(request, authToken, companyId);
        expect(response).toBeTruthy();
        leavePeriodId = response.body[0].leavePeriodId;
        payload = {
            ...SettingLeave.createHolidayScheme,
            leavePeriodId: leavePeriodId,
            userId: loginResponse.body.userId,
            updateUserId: loginResponse.body.userIdUpadate
        };
    });

    test("Create holiday - Happy flow @happy", async ({ request }) => {
        // Get the holiday data
        holiday = await leave.createHolidays(request, authToken, payload);
        expect(holiday).toBeTruthy();
        // If the helper returns a full response object, check status and body
        if (typeof holiday.status !== 'undefined') {
            ExpectResponse.okResponse(holiday.status);
        }

        const body = holiday.body ?? holiday;
        // Required fields
        expect(body.holidaySchemeId).toBeDefined();
        expect(body.holidaySchemeName).toBe(payload.holidaySchemeName || SettingLeave.createHolidayScheme.holidaySchemeName);
        expect(body.userId).toBe(payload.userId);
        // leavePeriodId may be returned as number — coerce to string for comparison with payload
        expect(String(body.leavePeriodId)).toBe(String(payload.leavePeriodId));
        // status in response is sometimes string '1' — accept both number and string
        expect(String(body.status)).toBe(String(payload.status ?? SettingLeave.createHolidayScheme.status));

        // Date assertions: dateCreated and dateUpdates should be equal (same timestamp when created)
        // Some APIs return timestamps in ms — assert existence and equality
        expect(body.dateCreated).toBeDefined();
        expect(body.dateUpdates).toBeDefined();
        expect(String(body.dateCreated)).toBe(String(body.dateUpdates));
    });
});
