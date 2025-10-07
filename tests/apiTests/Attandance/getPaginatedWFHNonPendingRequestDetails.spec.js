import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import applyWFHExpected from "../../fixtures/Response/applyWFH.json" assert { type: "json" };
import ExpectResponse from "../../utils/endpoints/expect/expectResponse";
import getPaginatedWFHExpected from "../../fixtures/Response/getPaginatedWFHExpected.json" assert { type: "json" };

test.describe("POST| -hrmsApi/workfromhomerequest/getPaginatedWFHPendingRequestDetails/emp/71/Nonpending, Get Paginated WFH Non Pending Request Details API", () => {
  let authToken, attendance;
  attendance = new Attandance();
  const tryWFHWithDifferentDates = async (
    attendance,
    request,
    basePayload,
    maxAttempts = 80
  ) => {
    for (let i = 0; i < maxAttempts; i++) {
      const testDate = new Date();
      testDate.setDate(testDate.getDate() + i + 1); // Start from tomorrow

      const payload = {
        ...basePayload,
        fromDate: testDate.toISOString(),
        toDate: testDate.toISOString(),
      };

      const response = await attendance.applyWFH(request, payload, authToken);
      response;
      if (response.status === 200) {
        return { success: true, response, payload };
      } else if (
        response.body.message ===
        "You have already applied Work from home in the given duration."
      ) {
        continue;
      } else {
        return { success: false, response, payload };
      }
    }
    return { success: false, response: null, payload: null };
  };

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

  test("Get Paginated WFH Completed Request Details - Success scenario @happy", async ({
    request,
  }) => {
    const response = await attendance.getPaginatedWFHNonPendingRequestDetails(
      request,
      getPaginatedWFHExpected.baseRequestBody,
      authToken
    );
    const responseBody = response.body;
    "WFH Paginated Response:", responseBody;

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

  test("Get Paginated WFH Completed Request Details - Verify entry appears after Apply @happy", async ({
    request,
  }) => {
    // Step 1: Get initial count
    const initialResponse =
      await attendance.getPaginatedWFHNonPendingRequestDetails(
        request,
        getPaginatedWFHExpected.baseRequestBody,
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
        await attendance.getPaginatedWFHNonPendingRequestDetails(
          request,
          getPaginatedWFHExpected.baseRequestBody,
          authToken
        );
      const updatedCount = updatedResponse.body.totalItems;
      const updatedData = updatedResponse.body.data;

      // Step 5: Validate new entry should not appear in Completed list
      expect(updatedCount).toBe(initialCount);

      const newWFHEntry = updatedData.find(
        (wfh) =>
          wfh.employeeRemark === applyWFHExpected.requestBody.employeeRemark &&
          wfh.status === "Pending"
      );

      expect(newWFHEntry).toBeDefined();
      expect(newWFHEntry.workFromHomeDateWiseId).toBeDefined();
    }
  });

  test("Get Paginated WFH Completed Request Details - Verify entry is removed/updated after Reject @happy", async ({
    request,
  }) => {
    // Use helper function to get successful response
    const result = await tryWFHWithDifferentDates(
      attendance,
      request,
      applyWFHExpected.requestBody
    );
    result;
    expect(result.success).toBe(true);

    expect(result.response.status).toBe(200);
    const wfhId = result.response.body.workFromHomeDateWiseId;
    "Applied WFH ID:", wfhId;

    // Step 2: Reject the same WFH request
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
    expect(rejectResponse.body.approvalStatus).toBe("REJ");

    // Step 3: Check pending list again
    const updatedResponse =
      await attendance.getPaginatedWFHPendingRequestDetails(
        request,
        getPaginatedWFHExpected.baseRequestBody,
        authToken
      );
    const updatedData = updatedResponse.body.data;

    // Step 4: Verify that rejected WFH does not appear in pending
    const rejectedEntry = updatedData.find(
      (wfh) => wfh.workFromHomeDateWiseId === wfhId
    );
    expect(rejectedEntry).toBeUndefined();
  });

  test("Get Paginated WFH Completed Request Details - Invalid pagination parameters @negative", async ({
    request,
  }) => {
    const invalidRequestBody = {
      ...getPaginatedWFHExpected.baseRequestBody,
      currentPage: -1, // Invalid negative page
    };
    const response = await attendance.getPaginatedWFHNonPendingRequestDetails(
      request,
      invalidRequestBody,
      authToken
    );
    const responseBody = response.body;
    "WFH Paginated Response:", responseBody;

    // Should return an error for invalid request
    ExpectResponse.badRequestMessage(response.body.message);
    ExpectResponse.badRequest(response.status);
  });

  test("Get Paginated WFH Completed Request Details - Without token @negative", async ({
    request,
  }) => {
    const response = await attendance.getPaginatedWFHNonPendingRequestDetails(
      request,
      getPaginatedWFHExpected.baseRequestBody
    );
    ExpectResponse.internalServerError(response.status);
  });

  test("Get Paginated WFH Completed Request Details  @happy- with Different page sizes", async ({
    request,
  }) => {
    const testCases = [
      { itemPerPage:5 },
      { itemPerPage: 10},
      { itemPerPage: 15},
      { itemPerPage: 20},
      { itemPerPage: 50},
      { itemPerPage: 500},
      { itemPerPage: 100},
    ];

    for (const testCase of testCases) {
      const requestBody = {
        ...getPaginatedWFHExpected.baseRequestBody,
        itemPerPage: testCase.itemPerPage,
      };

      const response = await attendance.getPaginatedWFHNonPendingRequestDetails(
        request,
        requestBody,
        authToken
      );

      const responseBody = response.body;

      expect(response.status).toBe(200);
      expect(responseBody.currentPage).toBe(0);
    }
  });

  test("Get Paginated WFH Completed Request Details @happy  - Sort by all fields with ASC and DESC", async ({ request }) => {
    const sortFields = ["name", "type", "date", "reason"];
    const sortDirections = ["ASC", "DESC"];
    
    for (const field of sortFields) {
      for (const direction of sortDirections) {
        const requestBody = {
        ...getPaginatedWFHExpected.baseRequestBody,
          sortBy: field,
          sortDirection: direction
        };
        
        
     const initialResponse =  await attendance.getPaginatedWFHNonPendingRequestDetails(
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
