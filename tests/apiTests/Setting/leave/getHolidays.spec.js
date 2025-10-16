import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("GET| /hrmsApi/holidays/hloiday/{holidayID}, get Holydays", () => {
  let authToken, response,leavePeriodId,holidayID;
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
    const companyId = loginResponse.body.companyId;
    const leaveresponse = await leave.getLeavePeriodstatus(request, authToken, companyId);
    leavePeriodId = leaveresponse.body[0].leavePeriodId;
    response = await leave.findAllHolydays(request, authToken, leavePeriodId);
    holidayID = response.body[0].holidayId;
  });

  test("Get Holydays - Happy flow @happy", async ({ request }) => {
    response = await leave.getHolidays(request, authToken, holidayID);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);

    // Assert the first item has all required keys
    const first = response.body;
    const expectedKeys = [
      "holidayId",
      "createdDate",
      "day",
      "fromDate",
      "toDate",
      "holidayName",
      "isMandatory",
      "userId",
      "companyId",
      "year",
      "daysName",
      "isMandatoryValue",
      "updateUserId",
      "count",
      "leavePeriodId",
      "activeStatus",
      "holidaySchemeId",
      "employeeId",
      "holidayType"
    ];
    expectedKeys.forEach(key => {
      expect(first).toHaveProperty(key);
    });


  });
});
