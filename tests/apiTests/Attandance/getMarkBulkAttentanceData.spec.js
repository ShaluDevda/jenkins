import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Organization } from "../../utils/endpoints/classes/settings/Organization";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";
import {
  extractBusinessunitList,
  extractDepartmentList,
  extractDesignationList,
  extractGradeList,
} from "../../utils/endpoints/classes/general/commonMethod.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("POST| getMarkBulkAttentanceData API", () => {
  let authToken;

  test.beforeEach(async ({ request }) => {
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

  test("POST | Get mark bulk attandance data - Happy flow @happy   ", async ({
    request,
  }) => {
    const organization = new Organization();
    const attendance = new Attandance();

    // Fetch month list from findAllPreviousMonthWithCurrent
    const monthResponse = await attendance.findAllPreviousMonthWithCurrent(
      request,
      authToken
    );
    expect(monthResponse.status).toBe(200);
    // Assume response.body is an array of month strings like ["Sept-2025", ...]
    const monthList = Array.isArray(monthResponse.body)
      ? monthResponse.body
      : [];
    const selectedMonth = monthList.length > 0 ? monthList[0] : "Sept-2025"; // fallback if empty

    // Fetch business units
    const businessUnitRes = await organization.getBusinessunitList(
      request,
      authToken
    );
    expect(businessUnitRes.status).toBe(200);
    const businessIdList = extractBusinessunitList(businessUnitRes.body).map(
      (bu) => bu.businessUnitId
    );

    // Fetch departments
    const departmentRes = await organization.getDepartmentList(
      request,
      authToken
    );
    expect(departmentRes.status).toBe(200);
    const departmentIdList = extractDepartmentList(departmentRes.body).map(
      (dep) => dep.departmentId
    );

    // Fetch designations
    const designationRes = await organization.getDesignationList(
      request,
      authToken
    );
    expect(designationRes.status).toBe(200);
    const designationListObj = extractDesignationList(designationRes.body).map(
      (des) => des.designationId
    );

    // Fetch grades
    const gradeRes = await organization.getFindGradeList(request, authToken);
    expect(gradeRes.status).toBe(200);
    const activeGrdeListObj = extractGradeList(gradeRes.body).map(
      (gr) => gr.employeeCode
    );

    // Build dynamic payload
    const payload = {
      employeeName: "",
      experience: "",
      cityIds: [],
      limit: 5,
      activeGrdeListObj,
      designationListObj,
      businessIdList,
      departmentIdList,
    };

    const response = await attendance.getMarkBulkAttentanceWithDate(
      request,
      selectedMonth,
      authToken,
      payload,
    );

    // Assertions for response structure and employee fields
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    for (const emp of response.body) {
      expect(emp).toHaveProperty("employeeCode");
      expect(typeof emp.employeeCode).toBe("string");
      expect(emp).toHaveProperty("employeeName");
      expect(typeof emp.employeeName).toBe("string");
      expect(emp).toHaveProperty("employeeId");
      expect(typeof emp.employeeId).toBe("number");
      expect(emp).toHaveProperty("departmentName");
      expect(typeof emp.departmentName).toBe("string");
      expect(emp).toHaveProperty("designationName");
      expect(typeof emp.designationName).toBe("string");
      expect(emp).toHaveProperty("attendanceLogMap");
      expect(typeof emp.attendanceLogMap).toBe("object");
      expect(emp).toHaveProperty("events");
      expect(Array.isArray(emp.events)).toBe(true);
      // Optionally check for other numeric fields
      expect(emp).toHaveProperty("weekoff");
      expect(emp).toHaveProperty("publicholidays");
      expect(emp).toHaveProperty("absenseForCalender");
      expect(emp).toHaveProperty("payDays");
      expect(emp).toHaveProperty("totalPresentDays");
    }
   
  });

});
