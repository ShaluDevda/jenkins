import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("GET| /hrmsApi/leaveTypeMaster/1, get find grade List", () => {
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

  test("Get leaveTypeMaster - Happy flow @happy", async ({ request }) => {
    const leave = new Leave();
    response = await leave.leaveTypeMaster(request, authToken);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    for (const item of response.body) {
      expect(item).toHaveProperty("leaveId");
      expect(typeof item.leaveId).toBe("number");

      expect(item).toHaveProperty("activeStatus");
      expect(typeof item.activeStatus).toBe("string");

      expect(item).toHaveProperty("companyId");
      expect(typeof item.companyId).toBe("number");

      expect(item).toHaveProperty("dateCreated");
      expect(typeof item.dateCreated).toBe("number");

      expect(item).toHaveProperty("dateUpdate");
      expect(typeof item.dateUpdate).toBe("number");

      expect(item).toHaveProperty("leaveName");
      expect(typeof item.leaveName).toBe("string");

      expect(item).toHaveProperty("userId");
      expect(typeof item.userId).toBe("number");

      expect(item).toHaveProperty("userIdUpdate");
      expect(typeof item.userIdUpdate).toBe("number");
    }
  });
});
