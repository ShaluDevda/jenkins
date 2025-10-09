import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("POST| /hrmsApi/holidays/findHolidayByLeavePeroid/{leavePeriodId}/{holidaySchemeId}, findHolidayByLeavePeroid", () => {
    let authToken, response, companyId, leavePeriodId, holidaySchemeId, getfindAllHolidays;
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
        leavePeriodId = response.body[0].leavePeriodId;
        getfindAllHolidays = await leave.findAllHolidays(request, authToken, leavePeriodId);
        holidaySchemeId = getfindAllHolidays.body[0].holidaySchemeId;
    });

    test("Create leave scheme - Happy flow @happy", async ({ request }) => {
        response = await leave.getfindHolidayByLeavePeroid(request, authToken, leavePeriodId, holidaySchemeId);
        console.log(response)
        expect(response).toBeTruthy();
        ExpectResponse.okResponse(response.status);
        // ensure the response array contains at least one object with the required keys (values ignored, null allowed)
       const requiredKeys = [
  'holidayId',
  'createdDate',
  'day',
  'fromDate',
  'toDate',
  'holidayName',
  'isMandatory',
  'userId',
  'companyId',
  'year',
  'daysName',
  'isMandatoryValue',
  'updateUserId',
  'count',
  'leavePeriodId',
  'activeStatus',
  'holidaySchemeId',
  'employeeId',
  'holidayType'
];

// Validate that every item in the response body contains all required keys
const allKeysPresent = Array.isArray(response.body) && response.body.every(item =>
  requiredKeys.every(key => Object.prototype.hasOwnProperty.call(item, key))
);

expect(allKeysPresent).toBeTruthy();

    });
});
