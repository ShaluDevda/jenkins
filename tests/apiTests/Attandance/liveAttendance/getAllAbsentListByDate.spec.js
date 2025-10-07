import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../utils/endpoints/classes/login.js";
import { liveAttendance } from "../../../utils/endpoints/classes/attandance/liveAttendance.js";
import loginExpected from "../../../fixtures/Response/loginExpected.json" assert { type: "json" };
import payload from "../../../fixtures/payloads/liveAttandance.json" assert { type: "json" };


test.describe("POST | Time & Attendance>Attendance>Live Attendance, getAllAbsentListByDate", () => {
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
test("getAllAbsentListByDate @happy   ", async ({ request }) => {
     LiveAttendance = new liveAttendance();
    const response = await LiveAttendance.getAllAbsentListByDate(
      request,
      authToken,
      payload.getAllLateComersListByDate
    );
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);

    // Assert if response body contains data array and has items
    if (Array.isArray(response.body) && response.body.length > 0) {
      const item = response.body[0];
      expect(item).toHaveProperty("empName");
      expect(item).toHaveProperty("empCode");
      expect(item).toHaveProperty("departmentName");
      expect(item).toHaveProperty("status");
      expect(item.status).toBe("Absent");
      expect(item).toHaveProperty("mode");
      expect(item).toHaveProperty("reportedLateBy");
      // Add more assertions as needed for other fields
    }
  });

});

