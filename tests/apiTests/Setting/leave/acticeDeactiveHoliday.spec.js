import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("POST| /hrmsApi/holidays/1, Active Deactive holiday", () => {
    let authToken, response, holiday;

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

    test("Active Deactive holiday - Happy flow @happy", async ({ request }) => {
        const leave = new Leave();
        // Get the holiday data
        holiday = await leave.getfindHolidayByLeavePeroid(request, authToken);
        const holidaydata = holiday.body[0];

        // Toggle activeStatus based on current value
        let newStatus = holidaydata.activeStatus === 'AC' ? 'DE' : 'AC';
        const payload = {
            ...holidaydata,
            createdDate: new Date().toISOString(), // current date-time
            activeStatus: newStatus, // toggle status
            updateUserId: loginExpected.happy.userId,
        };
        console.log('Toggling activeStatus from', holidaydata.activeStatus, 'to', newStatus);
        response = await leave.activeDeactiveHoliday(request, authToken, payload);
        ExpectResponse.okResponse(response.status);
    });
});
