import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("GET| /hrmsApi/leaveRules/{leavePeriodId}, get leaveRules List", () => {
  let authToken, response, leavePeriodId, companyId;
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
  });

  test("Get leaveRules - Happy flow @happy ", async ({ request }) => {

    response = await leave.leaveRules(request, authToken, leavePeriodId);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    expect(Array.isArray(response.body)).toBe(true);

    const first = response.body[0];
    expect(first).toHaveProperty("leaveRuleId");
    expect(first).toHaveProperty("activeStatus");
    expect(first).toHaveProperty("dateCreated");
    expect(first).toHaveProperty("leaveRuleHdId");
    expect(first).toHaveProperty("dateUpdate");
    expect(first).toHaveProperty("description");
    expect(first).toHaveProperty("ruleCode");
    expect(first).toHaveProperty("ruleName");
    expect(first).toHaveProperty("userId");
    expect(first).toHaveProperty("userIdUpdate");
    expect(first).toHaveProperty("days");
    expect(first).toHaveProperty("leaveRuleMasterId");
    expect(first).toHaveProperty("leaveTypeId");
    expect(first).toHaveProperty("leaveTypeRuleId");
  });
});
