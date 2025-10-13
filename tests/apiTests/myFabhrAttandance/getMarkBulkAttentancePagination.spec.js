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

test.describe("POST| getMarkBulkAttentancPagination API", () => {
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

  test("POST | Get mark bulk attandance data pagination- Happy flow @happy   ", async ({
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
    const selectedMonth = monthList.length > 0 ? monthList[0] : "Sept-2025"; 
    const limits = [5, 15, 25, 50, 100, 500];
    const randomLimit = limits[Math.floor(Math.random() * limits.length)];
    const params = selectedMonth + "/" + randomLimit;
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
      params,
      authToken,
      payload,
    );

    // Assertions for response structure
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("count");
    expect(typeof response.body.count).toBe("number");
    expect(response.body).toHaveProperty("pageIndexs");
    expect(Array.isArray(response.body.pageIndexs)).toBe(true);
    expect(response.body).toHaveProperty("pageIndexs2");
    expect(response.body.pageIndexs2 === null || Array.isArray(response.body.pageIndexs2)).toBe(true);

    // Optionally, check at least one pageIndexs object if array is not empty
    if (response.body.pageIndexs.length > 0) {
      expect(typeof response.body.pageIndexs[0]).toBe("object");
    }
    
   
  });

});

