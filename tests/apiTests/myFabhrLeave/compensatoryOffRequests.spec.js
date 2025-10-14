import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Leave } from "../../utils/endpoints/classes/settings/leave.js";
import payload from "../../fixtures/payloads/pagination.json" assert { type: "json" };
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("POST| -/hrmsApi/compensatoryOff/getPaginatedCompensatoryOffRequests/{flag}, Get Paginated Leave Pending and non pending Request Details API", () => {
  let authToken, leave, companyId, employeeId;
 
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
  // Capture dynamic ids for payloads
  companyId = loginResponse.body?.companyId;
  employeeId = loginResponse.body?.employeeId;
  expect(companyId).toBeDefined();
  expect(employeeId).toBeDefined();
    
  });

  test("Get Paginated CompensatoryOffRequests Pending Request Details - Success scenario  @happy", async ({ request }) => {
     leave = new Leave();
    const requestBody = {
      ...payload.pagination1,
      companyId: companyId,
      employeeId: employeeId,
    };

    const response = await leave.getPaginatedCompensatoryOffRequests(
      request,
      authToken,
      "Pending",
      requestBody,
    );
    console.log(JSON.stringify(response.body))
    
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

  test("Get Paginated CompensatoryOffRequests Non Pending Request Details - Success scenario  @happy", async ({ request }) => {
     leave = new Leave();
    const requestBody = {
      ...payload.pagination1,
      companyId: companyId,
      employeeId: employeeId,
    };

    const response = await leave.getPaginatedCompensatoryOffRequests(
      request,
      authToken,
      "NonPending",
      requestBody,
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

  test("Get Paginated CompensatoryOffRequests Pending Request Details - Invalid pagination parameters  @negative", async ({ request }) => {
    leave = new Leave();
    const invalidRequestBody = {
      ...payload.pagination1,
      companyId: companyId,
      employeeId: employeeId,
      currentPage: -1,
    };

    const response = await leave.getPaginatedCompensatoryOffRequests(
      request,
      authToken,
      "Pending",
      invalidRequestBody,
    );

    // Expect bad request for invalid pagination
    expect(response.status).toBe(400);
  });

  test("Get Paginated CompensatoryOffRequests Pending Request Details - Without authentication token  @negative", async ({ request }) => {
    leave = new Leave();
    const requestBody = {
      ...payload.pagination1,
      companyId: companyId,
      employeeId: employeeId,
    };

    // Call without token
    const response = await leave.getPaginatedCompensatoryOffRequests(
      request,
      undefined,
      "Pending",
      requestBody,
    );

    // Should not be successful
    expect(response.status).not.toBe(200);
  });

  test("Get Paginated CompensatoryOffRequests Pending Request Details - Different page sizes  @happy", async ({ request }) => {
    leave = new Leave();
    const testCases = [
      { itemPerPage: 1, expectedMaxItems: 1 },
      { itemPerPage: 10, expectedMaxItems: 10 },
      { itemPerPage: 20, expectedMaxItems: 20 },
    ];

    for (const testCase of testCases) {
      const requestBody = {
        ...payload.pagination1,
        companyId: companyId,
        employeeId: employeeId,
        itemPerPage: testCase.itemPerPage,
      };

      const response = await leave.getPaginatedCompensatoryOffRequests(
        request,
        authToken,
        "Pending",
        requestBody,
      );

      const responseBody = response.body;
      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody.data)).toBe(true);
      expect(responseBody.data.length).toBeLessThanOrEqual(testCase.expectedMaxItems);
      expect(responseBody.currentPage).toBe(0);
    }
  });

  // Additional leave-focused tests: validate structure, sorting and pagination for leave pending lists
  test("Get Paginated CompensatoryOffRequests Pending Request Details - Data shape and fields  @happy", async ({ request }) => {
    leave = new Leave();
    const requestBody = { ...payload.pagination1, companyId, employeeId };
    const response = await leave.getPaginatedCompensatoryOffRequests(request, authToken, "Pending", requestBody);
    expect(response.status).toBe(200);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty("data");
    expect(responseBody).toHaveProperty("currentPage");
    expect(responseBody).toHaveProperty("totalItems");
    expect(responseBody).toHaveProperty("totalPages");
    if (Array.isArray(responseBody.data) && responseBody.data.length > 0) {
      const first = responseBody.data[0];
      // Common fields expected in leave requests
      expect(first).toHaveProperty("employeeId");
      expect(first).toHaveProperty("companyId");
      expect(first).toHaveProperty("status");
    }
  });

  test("Get Paginated CompensatoryOffRequests Pending Request Details - All sorting scenarios  @happy", async ({ request }) => {
    leave = new Leave();
    const sortFields = ["requestOn", "date", "days", "name", "department"];
    const sortDirections = ["ASC", "DESC"];
    for (const field of sortFields) {
      for (const direction of sortDirections) {
        const requestBody = { ...payload.pagination1, companyId, employeeId, sortBy: field, sortDirection: direction };
        const response = await leave.getPaginatedCompensatoryOffRequests(request, authToken, "Pending", requestBody);
        expect(response.status).toBe(200);
        const responseBody = response.body;
        expect(responseBody).toHaveProperty("data");
        expect(Array.isArray(responseBody.data)).toBe(true);
        if (responseBody.data.length > 0) {
          const firstItem = responseBody.data[0];
          expect(firstItem).toHaveProperty("employeeId");
          expect(firstItem).toHaveProperty("companyId");
          expect(firstItem).toHaveProperty("status");
        }
      }
    }
  });
});
