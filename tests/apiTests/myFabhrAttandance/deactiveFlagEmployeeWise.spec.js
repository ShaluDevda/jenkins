import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import { Pagination } from "../../utils/endpoints/classes/Attandance/Pagination";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import applyWFHExpected from "../../fixtures/Response/applyWFH.json" assert { type: "json" };
import paginationPayload from "../../fixtures/payloads/pagination.json" assert { type: "json" };

let response, authToken, loginPage, loginBody, loginResponse, emp;
const attendance = new Attandance();
const pagination = new Pagination();
test.describe("PUT | Time & Attendance>Attendance>Work From Home>WFH History  deactiveFlagEmployeeWise ", () => {
  test.beforeEach(async ({ request }) => {
    // Login to get authentication token
    loginPage = new LoginPage();
    loginBody = {
      username: loginExpected.happy.loginName,
         password: loginExpected.happy.password,
    };
    loginResponse = await loginPage.loginAs(request, loginBody);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTruthy();
    authToken = loginResponse.body.token;
  });
  test("PUT | -/hrmsApi/workfromhomerequest/deactiveFlagEmployeeWise,  - Happy flow  @happy", async ({
    request,
  }) => {
    const requestBody = {
      ...paginationPayload.pagination1,
      itemPerPage: 500, // Fetch a large number to get all pending requests
    };
    const approveResponse =
      await pagination.overAllApprovalsNonPaginatedPendingsWFH(
        request,
        requestBody,
        authToken
      );
    expect(approveResponse.status).toBe(200);
    // Assert response.body is an array
    // expect(Array.isArray(response.body)).toBe(true);

    if (approveResponse.body.length > 0) {
      // Assert required fields in the first object
      emp = approveResponse.body.data[0];
      expect(emp).toHaveProperty("employeeId");
      expect(emp).toHaveProperty("employeeName");
      expect(emp).toHaveProperty("employeeCode");
      expect(emp).toHaveProperty("status");
      // ...add more field checks as needed
    }
    // Filter active (non-deactivated) entries
    const activeEntries = approveResponse.body.data.filter(
      (entry) => entry.employeeWFHStatus === null // Only get entries that haven't been deactivated
    );

    if (activeEntries.length > 0) {
      // Group entries by their type
      const sdEntries = activeEntries.filter(
        (entry) => entry.workfromhometypeshortname === "SD"
      );
      const hyEntries = activeEntries.filter(
        (entry) => entry.workfromhometypeshortname === "HY"
      );

      // Get IDs for each type
      const sdIds = sdEntries.map((entry) => entry.workFromHomeDateWiseId);
      const hyIds = hyEntries.map((entry) => entry.workFromHomeDateWiseId);

      // Determine which types to include based on what we found
      const typesToInclude = [];
      if (sdIds.length > 0) typesToInclude.push("SD");
      if (hyIds.length > 0) typesToInclude.push("HY");

      // Verify entries are actually deactivated
      const verifyResponse =
        await pagination.overAllApprovalsNonPaginatedPendingsWFH(
          request,
          requestBody,
          authToken
        );

      const deactivatedEntries = verifyResponse.body.data.filter((entry) =>
        [...sdIds, ...hyIds].includes(entry.workFromHomeDateWiseId)
      );

      // Deactivate one entry (either SD or HY)
      let deactivated = false;

      // Try SD entry first if available
      if (sdIds.length > 0 && !deactivated) {
        const id = sdIds[0]; // Take the first SD entry
        const deactivatePayload = {
          deactiveDate: new Date().toISOString().split(".")[0] + "Z",
          deactiveRemark: "test deactivation",
          employeeWFHStatus: "DE",
          updatedDate: new Date().toISOString().split(".")[0] + "Z",
          userIdUpdate: Number(loginExpected.happy.userId),
          workFromHomeDateWiseId: Number(id),
          workfromhometypeshortname: "SD",
        };

       
        response = await attendance.deactiveFlagEmployeeWise(
          request,
          deactivatePayload,
          authToken
        );
       
        expect(response.status).toBe(200);
        deactivated = true;
      }

      // If no SD entry was deactivated, try HY entry
      if (hyIds.length > 0 && !deactivated) {
        const id = hyIds[0]; // Take the first HY entry
        const deactivatePayload = {
          deactiveDate: new Date().toISOString().split(".")[0] + "Z",
          deactiveRemark: "test deactivation",
          employeeWFHStatus: "DE",
          updatedDate: new Date().toISOString().split(".")[0] + "Z",
          userIdUpdate: Number(loginExpected.happy.userId),
          workFromHomeDateWiseId: Number(id),
          workfromhometypeshortname: "HY",
        };

        

        response = await attendance.deactiveFlagEmployeeWise(
          request,
          deactivatePayload,
          authToken
        );
    
        expect(response.status).toBe(200);
      }
    }
  });
});
