import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import applyWFHExpected from "../../fixtures/Response/applyWFH.json" assert { type: "json" };
import { Pagination } from "../../utils/endpoints/classes/Attandance/Pagination";
import paginationPayload from "../../fixtures/payloads/pagination.json" assert { type: "json" };

let response;
test.describe.skip("Time & Attendance>Attendance get ActiveWFHEmployees ", () => {
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
  test("GET getActiveWFHEmployees  - Happy flow @happy", async ({
    request,
  }) => {
    const attendance = new Attandance();
    response = await attendance.getActiveWFHEmployees(request, authToken);
    expect(response.status).toBe(200);

    // Assert response.body is an array
    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      // Assert required fields in the first object
      const emp = response.body[0];
      expect(emp).toHaveProperty("employeeId");
      expect(emp).toHaveProperty("employeeName");
      expect(emp).toHaveProperty("employeeCode");
      expect(emp).toHaveProperty("status");
      // ...add more field checks as needed
    } else {
      // If array is empty, just assert it's empty
      expect(response.body.length).toBe(0);
    }
  });

  test("GET getActiveWFHEmployees with complete flow1 - Happy flow @happy", async ({
    request,
  }) => {
    const attendance = new Attandance();

    const today = new Date();
    const todayISO = today.toISOString();

    // Step 1: Try to apply WFH for today
    let applyPayload = {
      ...applyWFHExpected.requestBody,
      fromDate: todayISO,
      toDate: todayISO,
    };

    let applyResponse = await attendance.applyWFH(
      request,
      applyPayload,
      authToken
    );

    let wfhId;
    if (applyResponse.status === 200) {
      // Successfully applied
      wfhId = applyResponse.body.workFromHomeDateWiseId;

    } else if (
      applyResponse.body.message ===
      "You have already applied Work from home in the given duration."
    ) {
     const pagination = new Pagination();

      const response = await pagination.overAllApprovalsPaginatedPendingsWFH(
      request, 
      paginationPayload.pagination1, 
      authToken
    );

const today = new Date();
const todayStart = new Date(today.setHours(0, 0, 0, 0)).getTime();
const todayEnd = new Date(today.setHours(23, 59, 59, 999)).getTime();

let matchedRecord = null;

if (response.body && response.body.data && Array.isArray(response.body.data)) {
  for (let record of response.body.data) {
    // Use fromDate (or whichever field your logic requires)
    if (
      record.fromDate !== null &&
      record.fromDate >= todayStart &&
      record.fromDate <= todayEnd
    ) {
      matchedRecord = record;
      break;
    }
  }
}

if (matchedRecord)
 {

  const approvePayload = {
    ...applyWFHExpected.rejectWFHPayload,
    status: "APR",
    workFromHomeDateWiseId: matchedRecord.workFromHomeDateWiseId,
        approvalId: applyPayload.employeeId,
        employeeId: applyPayload.employeeId,
        userId: applyPayload.userId,
        userIdUpdate: applyPayload.userIdUpdate,
        fromDate: today.getTime(),
        toDate: today.getTime(),
        reasonSelect: applyPayload.reasonSelect,
        employeeRemark: applyPayload.employeeRemark,
      };

      const approveResponse = await attendance.rejectWFH(
        request,
        approvePayload,
        authToken
      );
    
      expect(approveResponse.status).toBe(200);
      wfhId = approvePayload.workFromHomeDateWiseId;
    }

    // Step 2: Get active WFH employees (this will work if already approved or just approved above)
   const getActiveWFHEmployeesResponse = await attendance.getActiveWFHEmployees(request, authToken);
    expect(getActiveWFHEmployeesResponse.status).toBe(200);
    expect(Array.isArray(getActiveWFHEmployeesResponse.body)).toBe(true);

    if (getActiveWFHEmployeesResponse.body.length > 0) {
      const emp = getActiveWFHEmployeesResponse.body[0];
      expect(emp).toHaveProperty("employeeId");
      expect(emp).toHaveProperty("employeeName");
      expect(emp).toHaveProperty("employeeCode");
      expect(emp).toHaveProperty("status");
    } else {
      expect(response.body.length).toBe(0);
    }
  }
  });
});