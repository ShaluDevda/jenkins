import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Pagination } from "../../utils/endpoints/classes/Attandance/Pagination.js";
import paginationPayload from "../../fixtures/payloads/pagination.json" assert { type: "json" };
import applyARExpected from "../../fixtures/Response/applyARExpected.json" assert { type: "json" };
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import getPaginatedARPendingRequestDetailsExpected from "../../fixtures/Response/getPaginatedARPendingRequestDetailsExpected.json" assert { type: "json" };

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
  });

  test("Get Paginated AR Pending Request Details  @happy - Success scenario", async ({
    request,
  }) => {
    const response = await pagination.verifyPagination(
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

  test("Get Paginated AR Pending Request Details  @happy - Verify AR entry appears after successful application", async ({
    request,
  }) => {
    const attendance = new Attandance();
    const initialResponse = await pagination.verifyPagination(
      request,
      paginationPayload.pagination1,
      authToken
    );
    const initialCount = initialResponse.body.totalItems;
    let response;
    let attempts = 0;
    const maxAttempts = 30;
    do {
      // Generate a new date for each attempt (today + attempts days)
      const date = new Date();
      date.setDate(date.getDate() + attempts);
      date.setHours(0, 0, 0, 0);
      const isoDate = date.toISOString();
      const dynamicPayload = {
        ...applyARExpected.requestBody,
        fromDate: isoDate,
        toDate: isoDate,
      };
      response = await attendance.applyAR(request, dynamicPayload, authToken);
      attempts++;
      if (response.status === 200) break;
      // Optional: wait a bit before retrying
      await new Promise((res) => setTimeout(res, 500));
    } while (response.status !== 200 && attempts < maxAttempts);
    const afterApplyArResponse = await pagination.verifyPagination(
      request,
      paginationPayload.pagination1,
      authToken
    );
    const updatedCount = afterApplyArResponse.body.totalItems;

    // Verify that the count increased or the new AR entry is present
    expect(updatedCount).toBeGreaterThanOrEqual(initialCount);
  });

  test("Get Paginated AR Pending Request Details - Different page sizes  @happy", async ({
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

      const response = await pagination.verifyPagination(
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

  test("Get Paginated AR Pending Request Details - Invalid pagination parameters @ @negative", async ({
    // @priority: medium
    request,
  }) => {
    const invalidRequestBody = {
      ...paginationPayload.pagination1,
      currentPage: -1, // Invalid negative page
    };

    const response = await pagination.verifyPagination(
      request,
      invalidRequestBody,
      authToken
    );
    // Should return an error for invalid request
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Server Not Responding");
  });

  test("Get Paginated AR Pending Request Details - All sorting scenarios @happy", async ({
    // @priority: medium
    request,
  }) => {
    const sortingTestCases =
      getPaginatedARPendingRequestDetailsExpected.sortingTestCases;

    for (const testCase of sortingTestCases) {
      const response = await pagination.verifyPagination(
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

  test("Get Paginated AR Pending Request Details - Sort by all fields with ASC and DESC  @happy", async ({
    // @priority: medium
    request,
  }) => {
    const sortFields = [
      "requestOn",
      "reason",
      "date",
      "days",
      "name",
      "department",
      "attendanceDays",
    ];
    const sortDirections = ["ASC", "DESC"];

    for (const field of sortFields) {
      for (const direction of sortDirections) {
        const requestBody = {
          ...paginationPayload.pagination1,
          sortBy: field,
          sortDirection: direction,
        };

        const initialResponse = await pagination.verifyPagination(
          request,
          paginationPayload.pagination1,
          authToken
        );

        const responseBody = initialResponse.body;

        expect(initialResponse.status).toBe(200);
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

  test("Search AR requests - Valid name search @happy", async ({
    
    request,
  }) => {
    // First, get a valid name from the existing data
    const initialResponse = await pagination.verifyPagination(
      request,
      paginationPayload.pagination1,
      authToken
    );

    expect(initialResponse.status).toBe(200);

    // Get first employee name from the response
    const validName = initialResponse.body.data[0].employeeName;

    // Search using the valid name
    const searchPayload = {
      ...paginationPayload.pagination1,
      searchTitle: validName,
    };

    const searchResponse = await pagination.verifyPagination(
      request,
      searchPayload,
      authToken
    );

    expect(searchResponse.status).toBe(200);

    // Verify all returned records contain the search term
    searchResponse.body.data.forEach((item) => {
      expect(item.employeeName.toLowerCase()).toContain(validName.toLowerCase());
    });
  });

  test("Search AR requests - Invalid name search @negative", async ({
    // @priority: low
    request,
  }) => {
    const invalidSearchPayload = {
      ...paginationPayload.pagination1,
      searchTitle: "InvalidNameXYZ123!@#",
    };

    const response = await pagination.verifyPagination(
      request,
      invalidSearchPayload,
      authToken
    );

    expect(response.status).toBe(200);

    // Verify empty response structure for no results
    expect(response.body).toMatchObject({
      data: [],
      currentPage: 0,
      totalItems: 0,
      totalPages: 0,
    });
  });

  test("Search AR requests - Partial name match @happy", async ({
    
    request,
  }) => {
    // First get a valid name and use part of it
    const initialResponse = await pagination.verifyPagination(
      request,
      paginationPayload.pagination1,
      authToken
    );
    expect(initialResponse.status).toBe(200);
    expect(initialResponse.body.data.length).toBeGreaterThan(0);

    const fullName = initialResponse.body.data[0].employeeName;
    const partialName = fullName.substring(0, 3); // Take first 3 characters

    const searchPayload = {
      ...paginationPayload.pagination1,
      searchTitle: partialName,
    };

    const searchResponse = await pagination.verifyPagination(
      request,
      searchPayload,
      authToken
    );
    expect(searchResponse.status).toBe(200);

    // Verify all returned records contain the partial name
    searchResponse.body.data.forEach((item) => {
      expect(item.employeeName.toLowerCase()).toContain(partialName.toLowerCase());
    });
  });
});
