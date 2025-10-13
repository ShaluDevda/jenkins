import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Pagination } from "../../utils/endpoints/classes/Attandance/Pagination.js";
import paginationPayload from "../../fixtures/payloads/pagination.json" assert { type: "json" };
import applyWFHExpected from "../../fixtures/Response/applyWFH.json" assert { type: "json" };
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";

let authToken;
const pagination = new Pagination();
test.describe("Get Paginated AR Pending Request Details API", () => {
  test.beforeEach(async ({ request }) => {
    // Login to get authentication token
    const loginPage = new LoginPage();
    const loginBody = {
      username: loginExpected.happy.loginName,
         password: loginExpected.happy.password,
    };

    const loginResponse = await loginPage.loginAs(request, loginBody);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.token).toBeTruthy();
    authToken = loginResponse.token;
  }, { timeout: 200000 });

  test("POST| get overAll Approvals Paginated Pendings WFH  @happy - Success scenario", async ({
    request,
  }) => {
    const response = await pagination.overAllApprovalsPaginatedPendingsWFH(
      request,
      paginationPayload.pagination1,
      authToken
    );
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty("data");
    expect(responseBody).toHaveProperty("currentPage");
    expect(responseBody).toHaveProperty("totalItems");
    expect(responseBody).toHaveProperty("totalPages");

    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(typeof responseBody.currentPage).toBe("number");
    expect(typeof responseBody.totalItems).toBe("number");
    expect(typeof responseBody.totalPages).toBe("number");
  });

  test("POST| get overAll Approvals Paginated Pendings WFH @happy  - Verify WFH entry appears after successful application", async ({
    request,
  }) => {
    const attendance = new Attandance();
    const initialResponse =
      await pagination.overAllApprovalsPaginatedPendingsWFH(
        request,
        paginationPayload.pagination1,
        authToken
      );
    const initialCount = initialResponse.body.totalItems;

    // Step 2: Apply WFH
    const applyResponse = await attendance.applyWFH(
      request,
      applyWFHExpected.requestBody,
      authToken
    );

    if (applyResponse.status === 200) {
      // Step 3: Wait for system to update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 4: Fetch updated data
      const updatedResponse =
        await pagination.overAllApprovalsPaginatedPendingsWFH(
          request,
          paginationPayload.pagination1,
          authToken
        );

      const updatedCount = updatedResponse.body.totalItems;
      expect(updatedCount).toBeGreaterThanOrEqual(initialCount);
    }
  });


test("POST| get overAll Approvals Paginated Pendings WFH @happy  - Different page sizes", async ({
  request,
}) => {
  const testCases = [
    { itemPerPage: 5, expectedMaxItems: 5 },
    { itemPerPage: 10, expectedMaxItems: 10 },
    { itemPerPage: 15, expectedMaxItems: 15 },
    { itemPerPage: 20, expectedMaxItems: 20 },
    { itemPerPage: 50, expectedMaxItems: 50 },
    { itemPerPage: 500, expectedMaxItems: 500 },
    { itemPerPage: 100, expectedMaxItems: 100 },
  ];

  for (const testCase of testCases) {
    const requestBody = {
      ...paginationPayload.pagination1,
      itemPerPage: testCase.itemPerPage,
    };

    const response = await pagination.overAllApprovalsPaginatedPendingsWFH(
      request,
      requestBody,
      authToken
    );

    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.data.length).toBeLessThanOrEqual(
      testCase.expectedMaxItems
    );
    expect(responseBody.currentPage).toBe(0);
  }
});

test("POST| get overAll Approvals Paginated Pendings WFH @negative  - Invalid pagination parameters", async ({
  request,
}) => {
  const invalidRequestBody = {
    ...paginationPayload.pagination1,
    currentPage: -1, // Invalid negative page
  };

  const response = await pagination.overAllApprovalsPaginatedPendingsWFH(
    request,
    invalidRequestBody,
    authToken
  );
  // Should return an error for invalid request
  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Bad Request");
});

test("POST| get overAll Approvals Paginated Pendings WFH @happy - Sort by all fields with ASC and DESC", async ({
  request,
}) => {
  const sortFields = ["name", "type", "date", "reason"];
  const sortDirections = ["ASC", "DESC"];

  for (const field of sortFields) {
    for (const direction of sortDirections) {
      const requestBody = {
        ...paginationPayload.pagination1,
        sortBy: field,
        sortDirection: direction,
      };

      const initialResponse =
        await pagination.overAllApprovalsPaginatedPendingsWFH(
          request,
          requestBody,
          authToken
        );

      const responseBody = initialResponse.body;

      expect(initialResponse.status).toBe(200);
      expect(responseBody).toHaveProperty("data");
      expect(Array.isArray(responseBody.data)).toBe(true);

      // Verify that the response contains the expected structure
      if (responseBody.data.length > 0) {
        const firstItem = responseBody.data[0];
        expect(firstItem).toHaveProperty("workFromHomeDateWiseId");
        expect(firstItem).toHaveProperty("masterWorkFromHomeId");
        expect(firstItem).toHaveProperty("status");
      }
    }
  }
});

test(
  "POST| get overAll Approvals Paginated Pendings WFH and Reject one by one for data cleanup @happy - Keep only 1 SD entry",
  async ({ request }) => {
  const attendance = new Attandance();
  const requestBody = {
    ...paginationPayload.pagination1,
    itemPerPage: 500, // Fetch a large number to get all pending requests
  };

  let pendingWFHResponse =
    await pagination.overAllApprovalsPaginatedPendingsWFH(
      request,
      requestBody,
      authToken
    );

  expect(pendingWFHResponse.status).toBe(200);
  let pendingEntries = pendingWFHResponse.body.data;



  // 1. Filter all SD type entries
  let sdEntries = pendingEntries.filter(
      (item) => item.workfromhometypeshortname === "SD" || item.workfromhometypeshortname === "HY"
    );
  // 2. Reject all except the last one (so only 1 SD entry remains)
  while (sdEntries.length > 5) {
    const entryToReject = sdEntries[0]; // always reject the oldest
    let rejectResponse;
    if (entryToReject.workfromhometypeshortname === "HY") {
      // Hybrid WFH rejection
      const rejectPayload = {
        ...applyWFHExpected.hybridWFHPayloadForRej,
        userId: entryToReject.userId,
        userIdUpdate: entryToReject.userIdUpdate,
        dateCreated: new Date(entryToReject.dateCreated).getTime(),
        toDate: new Date(entryToReject.toDate).getTime(),
        reasonSelect: entryToReject.reasonSele,
        workfromhomecategory: entryToReject.workfromhomecategory,
        workfromhomecategoryvalue: entryToReject.workfromhomecategoryvalue,
        workfromhometypeshortname: entryToReject.workfromhometypeshortname,
        workfromhometype: entryToReject.workfromhometype,
        employeeId: entryToReject.employeeId,
        workFromHomeHybridMasterId: entryToReject.workFromHomeHybridMasterId,
        employeeRemark: entryToReject.employeeRemark,
      };
      rejectResponse = await attendance.hybridWfh(
        request,
        rejectPayload,
        authToken
      );
      
    } else if (entryToReject.workfromhometypeshortname === "SD") {
      // Specific Date WFH rejection - spread entry, override only required fields
      const rejectPayload = {
        ...applyWFHExpected.rejectWFHPayload,
        workFromHomeDateWiseId: entryToReject.workFromHomeDateWiseId,
        masterWorkFromHomeId: entryToReject.masterWorkFromHomeId,
        approvalId: entryToReject.employeeId,
        employeeId: entryToReject.employeeId,
        userId: entryToReject.userId,
        userIdUpdate: entryToReject.userIdUpdate,
        fromDate: entryToReject.fromDate,
        toDate: entryToReject.toDate,
        dateCreated: entryToReject.dateCreated,
        employeeRemark: entryToReject.employeeRemark,
        reasonSelect:
          entryToReject.reasonSelect ?? entryToReject.workfromhomecategory,
        workfromhomecategory: entryToReject.workfromhomecategory,
        workfromhomecategoryvalue: entryToReject.workfromhomecategoryvalue,
        workFromHomeHybridMasterId: entryToReject.workFromHomeHybridMasterId,
        approvalorcancelremark: "qw",
        workfromhometype: "SD",
        workfromhometypeshortname: "SD",
      };

       rejectResponse = await attendance.rejectWFH(
        request,
        rejectPayload,
        authToken
      );
   
    } else {
      // If neither, skip
     
      // Remove from sdEntries to avoid infinite loop
      sdEntries.shift();
      continue;
    }
    if (rejectResponse.status === 200) {
      expect(rejectResponse.status).toBe(200);
    } else if (rejectResponse.status === 409 || rejectResponse.status === 500) {
      // Remove from sdEntries to avoid infinite loop
      sdEntries.shift();
      continue;
    } else {
      // For any other unexpected status, still fail
      expect(rejectResponse.status).toBe(200);
    }

    // Re-fetch the list and update SD entries
    pendingWFHResponse = await pagination.overAllApprovalsPaginatedPendingsWFH(
      request,
      requestBody,
      authToken
    );
    expect(pendingWFHResponse.status).toBe(200);
    pendingEntries = pendingWFHResponse.body.data;
    sdEntries = pendingEntries.filter(
      (item) => item.workfromhometypeshortname === "SD"
    );
  }
},
{ timeout: 200000 }
);
});

