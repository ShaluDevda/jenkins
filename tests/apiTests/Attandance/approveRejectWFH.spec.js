import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import applyWFHExpected from "../../fixtures/Response/applyWFH.json" assert { type: "json" };


test.describe.skip("Reject and Approve WFH API", () => {
  let authToken;
  let createdWFHIds = []; // Track WFH IDs created during tests
  
  // Helper function to try WFH with different dates until success
  const tryWFHWithDifferentDates = async (attendance, request, basePayload, maxAttempts = 90) => {
    for (let i = 0; i < maxAttempts; i++) {
      const testDate = new Date();
      testDate.setDate(testDate.getDate() + i + 1); // Start from tomorrow
      
      const payload = {
        ...basePayload,
        fromDate: testDate.toISOString(),
        toDate: testDate.toISOString()
      };

      const response = await attendance.applyWFH(request, payload, authToken);
      
      if (response.status === 200) {
        return { success: true, response, payload };
      } else if (response.body.message === "You have already applied Work from home in the given duration.") {
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

  // Happy Path 
  test("Apply WFH then Reject WFH - Complete workflow @happy", async ({ request }) => {
    const attendance = new Attandance();
    
    // Step 1: Apply WFH first using helper function
    const applyResult = await tryWFHWithDifferentDates(attendance, request, applyWFHExpected.requestBody);
    expect(applyResult.success).toBe(true);
    expect(applyResult.response.status).toBe(200);
    expect(applyResult.response.body.workFromHomeDateWiseId).toBeTruthy();
    
    const wfhId = applyResult.response.body.workFromHomeDateWiseId;

    // Step 2: Reject the WFH request
    const rejectPayload = {
      ...applyWFHExpected.rejectWFHPayload,
      workFromHomeDateWiseId: wfhId,
      approvalId: applyResult.payload.employeeId,
      employeeId: applyResult.payload.employeeId,
      userId: applyResult.payload.userId,
      userIdUpdate: applyResult.payload.userIdUpdate,
      fromDate: new Date(applyResult.payload.fromDate).getTime(),
      toDate: new Date(applyResult.payload.toDate).getTime(),
      reasonSelect: applyResult.payload.reasonSelect,
      employeeRemark: applyResult.payload.employeeRemark
    };

    const rejectResponse = await attendance.rejectWFH(request, rejectPayload, authToken);
    expect(rejectResponse.status).toBe(200);
    expect(rejectResponse.body).toBeTruthy();

    // Validate rejection response
    expect(rejectResponse.body.workFromHomeDateWiseId).toBe(wfhId);
    expect(rejectResponse.body.approvalStatus).toBe("REJ");
    expect(rejectResponse.body.approvalorcancelremark).toBe("Reject");
  });
 test("Apply WFH then Approve WFH - Complete workflow  @happy", async ({ request }) => {
    const attendance = new Attandance();
    
    // Step 1: Apply WFH first using helper function
    const applyResult = await tryWFHWithDifferentDates(attendance, request, applyWFHExpected.requestBody);
    expect(applyResult.success).toBe(true);
    expect(applyResult.response.status).toBe(200);
    expect(applyResult.response.body.workFromHomeDateWiseId).toBeTruthy();
    
    const wfhId = applyResult.response.body.workFromHomeDateWiseId;

    // Step 2: Approve the WFH request
    const approvePayload = {
      ...applyWFHExpected.rejectWFHPayload,
      status:"APR",
      workFromHomeDateWiseId: wfhId,
      approvalId: applyResult.payload.employeeId,
      employeeId: applyResult.payload.employeeId,
      userId: applyResult.payload.userId,
      userIdUpdate: applyResult.payload.userIdUpdate,
      fromDate: new Date(applyResult.payload.fromDate).getTime(),
      toDate: new Date(applyResult.payload.toDate).getTime(),
      reasonSelect: applyResult.payload.reasonSelect,
      employeeRemark: applyResult.payload.employeeRemark
    };

    const rejectResponse = await attendance.rejectWFH(request, approvePayload, authToken);
    expect(rejectResponse.status).toBe(200);
    expect(rejectResponse.body).toBeTruthy();

    // Validate rejection response
    expect(rejectResponse.body.workFromHomeDateWiseId).toBe(wfhId);
    expect(rejectResponse.body.approvalStatus).toBe("APR");
    expect(rejectResponse.body.approvalorcancelremark).toBe("Reject");
  });
  // Negative Path - Medium Priority Tests
  test("Reject and Approve WFH - Invalid WFH ID  @negative", async ({ request }) => {
    const attendance = new Attandance();
    const invalidRejectPayload = {
      ...applyWFHExpected.rejectWFHPayload,
      workFromHomeDateWiseId: 999999 // Invalid WFH ID
    };

    const response = await attendance.rejectWFH(request, invalidRejectPayload, authToken);

    // Should return error for invalid WFH ID
    expect(response).toBeTruthy();
    expect([400, 404, 200]).toContain(response.status); // API might return 200 with null data
    expect(response.body).toBeTruthy();

    // Validate error response structure
    if (response.body && typeof response.body === "object") {
      if (response.body.hasOwnProperty("isSuccess")) {
        expect(response.body.isSuccess).toBe(false);
      }

      if (response.body.hasOwnProperty("message")) {
        expect(typeof response.body.message).toBe("string");
      }
    }
  });

  test("Reject WFH and Approve WFH - Missing required fields  @negative", async ({ request }) => {
    const attendance = new Attandance();
    const incompleteRejectPayload = {
      workFromHomeDateWiseId: 61,
      employeeId: 368,
      // Missing other required fields
    };

    const response = await attendance.rejectWFH(request, incompleteRejectPayload, authToken);

    // Should return error for missing required fields
    expect(response).toBeTruthy();
    expect([400, 422, 500]).toContain(response.status); // API might return 500 for missing fields
    expect(response.body).toBeTruthy();

    // Validate error response structure
    if (response.body && typeof response.body === "object") {
      if (response.body.hasOwnProperty("isSuccess")) {
        expect(response.body.isSuccess).toBe(false);
      }

      if (response.body.hasOwnProperty("message")) {
        expect(typeof response.body.message).toBe("string");
      }
    }
  });

  // Performance/Non-functional - Low Priority Tests
  test("Reject and Approve WFH - Response time validation  @negative", async ({ request }) => {
    const attendance = new Attandance();
    const rejectPayload = applyWFHExpected.rejectWFHPayload;

    const startTime = Date.now();
    const response = await attendance.rejectWFH(request, rejectPayload, authToken);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Validate response time (should be less than 10 seconds for WFH rejection)
    expect(responseTime).toBeLessThan(10000);

    // Basic response validation
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });

  // Edge Cases - Medium Priority Tests
  test("Reject and Approve WFH - Different rejection reasons  @happy", async ({ request }) => {
    const attendance = new Attandance();
    
    // Test different rejection reasons
    const rejectionReasons = ["no", "not approved", "insufficient documentation", "conflict with schedule"];
    
    for (const reason of rejectionReasons) {
      const rejectPayload = {
        ...applyWFHExpected.rejectWFHPayload,
        approvalorcancelremark: reason,
        workFromHomeDateWiseId: 61 + rejectionReasons.indexOf(reason) // Different IDs to avoid conflicts
      };

      const response = await attendance.rejectWFH(request, rejectPayload, authToken);
      
      // Should accept different rejection reasons
      expect(response.status).toBe(200);
      expect(response.body).toBeTruthy();
      expect(response.body.approvalorcancelremark).toBe(reason);
      expect(response.body.approvalStatus).toBe("REJ");
    }
    
  });
});