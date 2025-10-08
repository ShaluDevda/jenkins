import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Pagination } from "../../utils/endpoints/classes/Attandance/Pagination.js";
import paginationPayload from "../../fixtures/payloads/pagination.json" assert { type: "json" };
import applyWFHExpected from "../../fixtures/Response/applyWFH.json" assert { type: "json" };
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";
const    attendance = new Attandance();

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
  
  });

  test("POST| get overAll Approvals Paginated Non Pendings WFH  @happy - Success scenario", async ({ request }) => {
    const response = await pagination.overAllApprovalsNonPaginatedPendingsWFH(
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

  test("POST| get overAll Approvals Non Paginated Pendings WFH @happy - Verify WFH entry appears after successful application", async ({ request }) => {
    const initialResponse = await pagination.overAllApprovalsNonPaginatedPendingsWFH(
      request, 
      paginationPayload.pagination1, 
      authToken
    );
    const initialCount = initialResponse.body.totalItems;
    const pendingWFHlist = await pagination.overAllApprovalsPaginatedPendingsWFH(
      request, 
      paginationPayload.pagination1, 
      authToken
    );
    const response = pendingWFHlist.body;
    if (response.data.length === 0) {
      console.error("No pending WFH requests to approve.");
      return;
    }else 
        {
      const wfhId = response.data[0].workFromHomeDateWiseId;

      const rejectPayload = {
      ...applyWFHExpected.rejectWFHPayload,
      workFromHomeDateWiseId: wfhId,
    };
    const rejectResponse = await attendance.rejectWFH(
      request,
      rejectPayload,
      authToken
    );
    expect(rejectResponse.status).toBe(200);
     if (rejectResponse.status === 200) 
        {
      // Step 3: Wait for system to update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 4: Fetch updated data
      const updatedResponse =
         await pagination.overAllApprovalsNonPaginatedPendingsWFH(
      request, 
      paginationPayload.pagination1, 
      authToken
    );

      const updatedCount = updatedResponse.body.totalItems;

      expect(updatedCount).toBeGreaterThanOrEqual(initialCount);
    }
    }
   
  });

   test("POST| get overAll Approvals Non Paginated Pendings WFH @happy  - Different page sizes", async ({ request }) => {
   
    const testCases = [
      { itemPerPage: 5, expectedMaxItems: 5 },
      { itemPerPage: 10, expectedMaxItems: 10 },
      { itemPerPage: 15, expectedMaxItems: 15 },
      { itemPerPage: 20, expectedMaxItems: 20 },
      { itemPerPage: 50, expectedMaxItems: 50 },
      { itemPerPage: 500, expectedMaxItems: 500 },
      { itemPerPage: 100, expectedMaxItems: 100 }
    ];

    for (const testCase of testCases) {
      const requestBody = {
        ...paginationPayload.pagination1, 
        itemPerPage: testCase.itemPerPage
      };

      const response = await pagination.overAllApprovalsNonPaginatedPendingsWFH(
        request, 
        requestBody, 
        authToken
      );
      
      const responseBody = response.body;

      expect(response.status).toBe(200);
      expect(responseBody.data.length).toBeLessThanOrEqual(testCase.expectedMaxItems);
      expect(responseBody.currentPage).toBe(0);
    }
  });

  test("POST| get overAll Approvals Non Paginated Pendings WFH @negative   - Invalid pagination parameters", async ({ request }) => {
   
    const invalidRequestBody = {
      ... paginationPayload.pagination1, 
      currentPage: -1, // Invalid negative page
     
    };

   const response = await pagination.overAllApprovalsNonPaginatedPendingsWFH(
      request, 
      invalidRequestBody, 
      authToken
    );
    // Should return an error for invalid request
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Bad Request");
  });

  test("POST| get overAll Approvals Non Paginated Pendings WFH @happy - Sort by all fields with ASC and DESC", async ({ request }) => {
    const sortFields = ["name", "type", "date", "reason"];
    const sortDirections = ["ASC", "DESC"];
    
    for (const field of sortFields) {
      for (const direction of sortDirections) {
        const requestBody = {
          ...paginationPayload.pagination1,
          sortBy: field,
          sortDirection: direction
        };
        
        
     const initialResponse = await pagination.overAllApprovalsNonPaginatedPendingsWFH(
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

});