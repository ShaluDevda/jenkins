import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("GET| /hrmsApi/holidays/findAllHolydays/5, get findAllHolydays", () => {
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

  test("Get findAllHolydays - Happy flow @happy", async ({ request }) => {
    const leave = new Leave();
    response = await leave.findAllHolydays(request, authToken);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    expect(Array.isArray(response.body)).toBe(true);

    // Assert the first item matches the expected structure and values
    const first = response.body[0];
   

    // Optionally, check all items have required properties and types
    for (const item of response.body) {
      expect(item).toHaveProperty("holidayId");
      expect(typeof item.holidayId).toBe("number");

      expect(item).toHaveProperty("createdDate");
      expect(typeof item.createdDate).toBe("number");

      expect(item).toHaveProperty("day");
      expect(typeof item.day).toBe("number");

      expect(item).toHaveProperty("fromDate");
      expect(typeof item.fromDate).toBe("number");

      expect(item).toHaveProperty("toDate");
      expect(typeof item.toDate).toBe("number");

      expect(item).toHaveProperty("holidayName");
      expect(typeof item.holidayName).toBe("string");

      expect(item).toHaveProperty("isMandatory");
      expect(typeof item.isMandatory).toBe("number");

      expect(item).toHaveProperty("userId");
      expect(typeof item.userId).toBe("number");

      expect(item).toHaveProperty("companyId");
      expect(typeof item.companyId).toBe("number");

      expect(item).toHaveProperty("year");
      expect(typeof item.year).toBe("string");

      expect(item).toHaveProperty("daysName");
      expect(typeof item.daysName).toBe("string");

      expect(item).toHaveProperty("isMandatoryValue");
      expect(typeof item.isMandatoryValue).toBe("string");

      expect(item).toHaveProperty("updateUserId");
      // updateUserId can be null

      expect(item).toHaveProperty("count");
      // count can be null

      expect(item).toHaveProperty("leavePeriodId");
      expect(typeof item.leavePeriodId).toBe("number");

      expect(item).toHaveProperty("activeStatus");
      expect(typeof item.activeStatus).toBe("string");

      expect(item).toHaveProperty("holidaySchemeId");
      // holidaySchemeId can be null

      expect(item).toHaveProperty("employeeId");
      // employeeId can be null

      expect(item).toHaveProperty("holidayType");
      expect(typeof item.holidayType).toBe("string");
    }
  });
});
