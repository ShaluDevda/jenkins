
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import { extractDesignationNames } from "../../utils/endpoints/classes/general/commonMethod";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("Time & Attendance>Attendance get designation", () => {
  let authToken;

  test.beforeEach(async ({ request }) => {
    // Login to get authentication token
    const loginPage = new LoginPage();
    const loginBody = {
      username: loginExpected.happy.loginName,
         password: loginExpected.happy.password,
    };
    const loginResponse = await loginPage.loginAs(request, loginBody);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTruthy();
    authToken = loginResponse.body.token;
  });

  test("GET designation - Happy flow @happy   ", async ({ request }) => {
    const attendance = new Attandance();
    const response = await attendance.getDesignation(request, authToken);
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Validate each designation object
    const ids = new Set();
    for (const item of response.body) {
      expect(item).toHaveProperty("designationId");
      expect(typeof item.designationId).toBe("number");
      expect(item).toHaveProperty("designationName");
      expect(typeof item.designationName).toBe("string");
      expect(item.designationName.length).toBeGreaterThan(0);
      expect(item).toHaveProperty("companyId");
      expect(typeof item.companyId).toBe("number");
      expect(item).toHaveProperty("departmentId");
      expect(typeof item.departmentId).toBe("number");
      expect(item).toHaveProperty("activeStatus");
      expect(item.activeStatus).toBe("AC");
      [
        "allowModi",
        "dateCreated",
        "dateUpdate",
        "departmentName",
        "effectiveEndDate",
        "effectiveStartDate",
        "groupId",
        "userId",
        "userIdUpdate",
        "deptDesignationMapping",
        "department",
      ].forEach((key) => expect(item).toHaveProperty(key));
      expect(ids.has(item.designationId)).toBe(false);
      ids.add(item.designationId);
    }

    // Store all designation names for future use
    const allDesignationNames = extractDesignationNames(response.body);

    // Optional: Check for at least one known designation
    expect(allDesignationNames.some(name => name === "Team Lead" || name === "CEO")).toBe(true);
  });
});
