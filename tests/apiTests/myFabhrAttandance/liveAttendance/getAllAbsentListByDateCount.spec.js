import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import { liveAttendance } from "../../../utils/endpoints/classes/Attandance/liveAttendance.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };
import payload from "../../../fixtures/payloads/liveAttandance.json" assert { type: "json" };


test.describe("POST | Time & Attendance>Attendance>Live Attendance, getAllAbsentListByDateCount", () => {
  let authToken, loginPage, LiveAttendance;

  test.beforeEach(async ({ request }) => {
    // Login to get authentication token
     loginPage = new LoginPage();
    const loginBody = {
      username: loginExpected.happy.loginName,
         password: loginExpected.happy.password,
    };
    const loginResponse = await loginPage.loginAs(request, loginBody);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTruthy();
    authToken = loginResponse.body.token;
  });
test("getAllAbsentListByDateCount @happy   ", async ({ request }) => {
     LiveAttendance = new liveAttendance();
    const response = await LiveAttendance.getAllAbsentListByDateCount(
      request,
      authToken,
      payload.getAllLateComersListByDate
    );
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);

    // Assert response structure
    expect(response.body).toHaveProperty("count");
    expect(typeof response.body.count).toBe("number");

    expect(response.body).toHaveProperty("pageIndexs");
    expect(Array.isArray(response.body.pageIndexs)).toBe(true);
    expect(response.body.pageIndexs.length).toBeGreaterThan(0);

    for (const page of response.body.pageIndexs) {
      expect(page).toHaveProperty("pageIndex");
      expect(typeof page.pageIndex).toBe("number");
      expect(page).toHaveProperty("pageIndex2");
      expect(typeof page.pageIndex2).toBe("number");
    }

    expect(response.body).toHaveProperty("pageIndexs2");
    expect(response.body.pageIndexs2).toBeNull();
  });

});

