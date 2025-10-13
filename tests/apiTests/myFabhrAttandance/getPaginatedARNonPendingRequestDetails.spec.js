import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";
import getPaginatedARPendingRequestDetailsExpected from "../../fixtures/Response/getPaginatedARPendingRequestDetailsExpected.json" assert { type: "json" };
import applyARExpected from "../../fixtures/Response/applyARExpected.json" assert { type: "json" };
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("POST| -/ hrmsApi/attendanceregularizationrequest/getPaginatedARPendingRequestDetails/emp/71/Nonpending, Get Paginated AR non Pending Request Details API", () => {
  let authToken, loginBody, loginPage;
  let attendance = new Attandance();
  

  test.beforeEach(async ({ request }) => {
    // Login to get authentication token
     loginPage = new LoginPage();
     loginBody = {
      username: loginExpected.happy.loginName,
         password: loginExpected.happy.password,
    };
    
    const loginResponse = await loginPage.loginAs(request, loginBody);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.token).toBeTruthy();
    authToken = loginResponse.token;
    
  });

  test("Get Paginated AR Non Pending Request Details - Success scenario @happy", async ({ request }) => {
    const response = await attendance.getPaginatedARNonPendingRequestDetails(
      request, 
      getPaginatedARPendingRequestDetailsExpected.baseRequestBody, 
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

  test(" Get Paginated AR Non Pending(completed) Request Details - Verify AR entry appears after successful application @happy", async ({ request }) => {
    // First, get initial count of pending AR requests
    const initialResponse = await attendance.getPaginatedARNonPendingRequestDetails(
      request, 
      getPaginatedARPendingRequestDetailsExpected.baseRequestBody, 
      authToken
    );
    
    const initialCount = initialResponse.body.totalItems;

    // Apply AR
    const applyARResponse = await attendance.applyAR(request, applyARExpected.requestBody, authToken);

    // If AR was successfully applied, check if it appears in pending requests
    if (applyARResponse.status === 200) {
      // Wait a moment for the system to process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get updated count of pending AR requests
      const updatedResponse = await attendance.getPaginatedARPendingRequestDetails(
        request, 
        getPaginatedARPendingRequestDetailsExpected.baseRequestBody, 
        authToken
      );
      
      const updatedCount = updatedResponse.body.totalItems;
      const updatedData = updatedResponse.body.data;
  
      // Verify that the count increased or the new AR entry is present
      expect(updatedCount).toBeGreaterThanOrEqual(initialCount);
      
      // Find the newly applied AR entry
      const newAREntry = updatedData.find(ar => 
        ar.arCategory === applyARExpected.requestBody.arCategory &&
        ar.days === applyARExpected.requestBody.days &&
        ar.employeeRemark === applyARExpected.requestBody.employeeRemark &&
        ar.status === "PEN"
      );
      expect(newAREntry).toBeDefined();
      expect(newAREntry.arID).toBeDefined();
      expect(newAREntry.arCategory).toBe(applyARExpected.requestBody.arCategory);
      expect(newAREntry.days).toBe(applyARExpected.requestBody.days);
      expect(newAREntry.employeeRemark).toBe(applyARExpected.requestBody.employeeRemark);
      expect(newAREntry.status).toBe("PEN");
      expect(newAREntry.employeeId).toBe(applyARExpected.requestBody.employeeId);
      expect(newAREntry.companyId).toBe(applyARExpected.requestBody.companyId);
    }
  });

  test("Get Paginated AR NONPending(completed) Request Details - Invalid pagination parameters @negative", async ({ request }) => {
    const invalidRequestBody = {
      ...getPaginatedARPendingRequestDetailsExpected.baseRequestBody,
      currentPage: -1, // Invalid negative page
     
    };

    const response = await attendance.getPaginatedARNonPendingRequestDetails(
      request, 
      invalidRequestBody, 
      authToken
    );
    
    const responseBody = response.body;

    // Should return an error for invalid request
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Bad Request");
  });

  test("Get Paginated AR NONPending(completed) Request Details - Without authentication token @negative ", async ({ request }) => {
    const response = await attendance.getPaginatedARNonPendingRequestDetails(
      request, 
      getPaginatedARPendingRequestDetailsExpected.baseRequestBody
    ); // No token passed
    
    const responseBody = response.body;

    // Should return an error for missing authentication
    expect(response.status).not.toBe(200);
  });

  test("Get Paginated AR NONPending(completed) Request Details - Different page sizes  @happy", async ({ request }) => {
    const testCases = [
      { itemPerPage: 1, expectedMaxItems: 1 },
      { itemPerPage: 10, expectedMaxItems: 10 },
      { itemPerPage: 20, expectedMaxItems: 20 }
    ];

    for (const testCase of testCases) {
      const requestBody = {
        ...getPaginatedARPendingRequestDetailsExpected.baseRequestBody,
        itemPerPage: testCase.itemPerPage
      };

      const response = await attendance.getPaginatedARNonPendingRequestDetails(
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

  test("Get Paginated AR NONPending(completed) Request Details - All sorting scenarios  @happy", async ({ request }) => {
    const sortingTestCases = getPaginatedARPendingRequestDetailsExpected.sortingTestCases;
    
    for (const testCase of sortingTestCases) {
      
      const response = await attendance.getPaginatedARNonPendingRequestDetails(
        request, 
        testCase.payload, 
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
      
      // Verify that the response contains the expected structure
      if (responseBody.data.length > 0) {
        const firstItem = responseBody.data[0];
        expect(firstItem).toHaveProperty("arID");
        expect(firstItem).toHaveProperty("arCategory");
        expect(firstItem).toHaveProperty("status");
        expect(firstItem).toHaveProperty("employeeId");
        expect(firstItem).toHaveProperty("companyId");
      }
    }
  });

  test("Get Paginated AR NONPending(completed) Request Details - Sort by all fields with ASC and DESC  @happy", async ({ request }) => {
    const sortFields = ["requestOn", "reason", "date", "days", "name", "department", "attendanceDays"];
    const sortDirections = ["ASC", "DESC"];
    
    for (const field of sortFields) {
      for (const direction of sortDirections) {
        const requestBody = {
          ...getPaginatedARPendingRequestDetailsExpected.baseRequestBody,
          sortBy: field,
          sortDirection: direction
        };
        
        
        const response = await attendance.getPaginatedARNonPendingRequestDetails(
          request, 
          requestBody, 
          authToken
        );
        
        const responseBody = response.body;

        expect(response.status).toBe(200);
        expect(responseBody).toHaveProperty("data");
        expect(Array.isArray(responseBody.data)).toBe(true);
        
        // Verify that the response contains the expected structure
        if (responseBody.data.length > 0) {
          const firstItem = responseBody.data[0];
          expect(firstItem).toHaveProperty("arID");
          expect(firstItem).toHaveProperty("arCategory");
          expect(firstItem).toHaveProperty("status");
        }
      }
    }
  });
});
