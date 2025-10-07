import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance} from "../../utils/endpoints/classes/Attandance/myAttandance";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import applyWFHExpected from "../../fixtures/Response/applyWFH.json" assert { type: "json" };
let authToken;


test.describe.skip("POST| -/hrmsApi/workfromhomerequest, Apply WFH API", () => {
  let createdWFHIds = []; // Track WFH IDs created during tests
  // Helper function to try WFH with different dates until success
  const tryWFHWithDifferentDates = async (attendance, request, payload, maxAttempts = 200) => {
    
    for (let i = 0; i < maxAttempts; i++) {
      const testDate = new Date();
      testDate.setDate(testDate.getDate() + i + 1); // Start from tomorrow
      
      const dynamicPayload = {
        ...applyWFHExpected.requestBody,
        fromDate: testDate.toISOString(),
        toDate: testDate.toISOString()
      };
      
      const response = await attendance.applyWFH(request, dynamicPayload, authToken);
      if (response.status === 200) {
        return { success: true, response, payload: dynamicPayload };
      } else if (response.body.message === "You have already applied Work from home in the given duration.") {
        continue;
      } else {
        // Log other errors but continue trying
      }
    }
    console.error(`Failed to apply WFH after ${maxAttempts} attempts.`);
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

  test.afterEach(async ({ request }) => {
    // Cleanup: Cancel all WFH requests created in the test
    const attendance = new Attandance();
    for (const wfhId of createdWFHIds) {
      const cancelPayload = {
        ...applyWFHExpected.rejectWFHPayload, // Using a base payload
        workFromHomeDateWiseId: wfhId,
        status: "CAN", // Set status to Cancel
        approvalorcancelremark: "Automated test cleanup"
      };
      const cancelResponse = await attendance.rejectWFH(request, cancelPayload, authToken);
      expect(cancelResponse.status).toBe(200);
    }
    createdWFHIds = []; // Reset the array for the next test
  });

 
 test("Apply WFH - Happy flow  @happy", async ({ request }) => {
    // Use helper function to get successful response
     const attendance = new Attandance();
    const result = await tryWFHWithDifferentDates(attendance, request, applyWFHExpected.requestBody);
    expect(result.success).toBe(true);

    const response = result.response;
    const payload = result.payload;   // ✅ FIX: pull payload from result
    
    // Basic response validation
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  
    const resBody = response.body;
  
    // Track WFH ID for cleanup
    if (resBody.workFromHomeDateWiseId) {
      createdWFHIds.push(resBody.workFromHomeDateWiseId);
    }
    
    // Validate response fields
    expect(resBody).toHaveProperty("workFromHomeDateWiseId");
    expect(resBody).toHaveProperty("dateCreated");
    expect(resBody).toHaveProperty("employeeId");
    expect(resBody).toHaveProperty("wfhCategory");
    expect(resBody).toHaveProperty("fromDate");
    expect(resBody).toHaveProperty("toDate");
    expect(resBody).toHaveProperty("approvalStatus");
    expect(resBody).toHaveProperty("userId");
    expect(resBody).toHaveProperty("userIdUpdate");
    expect(resBody).toHaveProperty("employeeRemark");
    expect(resBody).toHaveProperty("masterWorkFromHome");
  
    // Status mapping check
    expect(resBody.approvalStatus).toBe("PEN");
    expect(resBody.wfhCategory).toBe(payload.reasonSelect);
  
    // Date validations (ISO → epoch)
    const fromDateEpoch = new Date(payload.fromDate).getTime();
    const toDateEpoch = new Date(payload.toDate).getTime();
    expect(resBody.fromDate).toBe(fromDateEpoch);
    expect(resBody.toDate).toBe(toDateEpoch);
  
    // Nested object check
    expect(resBody.masterWorkFromHome.workFromHomeTypeShortName).toBe("SD");
    expect(resBody.masterWorkFromHome.workFromHomeType).toBe("Specific date");
    expect(resBody.masterWorkFromHome).toHaveProperty("masterWorkFromHomeId");
    expect(resBody.masterWorkFromHome).toHaveProperty("companyId");
  });
  

  test("Apply WFH - Duplicate request (already applied)  @happy", async ({ request }) => {
    const attendance = new Attandance();
    
    // First request - should succeed using helper function
    const firstResult = await tryWFHWithDifferentDates(attendance, request, applyWFHExpected.requestBody);
    expect(firstResult.success).toBe(true);
    expect(firstResult.response.status).toBe(200);

    // Track WFH ID for cleanup
    if (firstResult.response.body.workFromHomeDateWiseId) {
      createdWFHIds.push(firstResult.response.body.workFromHomeDateWiseId);
    }

    // Second request with same data - should return duplicate error
    const secondResponse = await attendance.applyWFH(request, firstResult.payload, authToken);
    // Should return 500 status with specific error message
    expect(secondResponse.status).toBe(500);
    expect(secondResponse.body).toBeTruthy();

    const errorBody = secondResponse.body;
    expect(errorBody).toHaveProperty("statusCode");
    expect(errorBody).toHaveProperty("message");
    expect(errorBody).toHaveProperty("data");
    expect(errorBody).toHaveProperty("isSuccess");
    expect(errorBody).toHaveProperty("errorCode");
    expect(errorBody).toHaveProperty("errorMsg");

    // Validate specific error values
    expect(errorBody.statusCode).toBe(500);
    expect(errorBody.message).toBe("You have already applied Work from home in the given duration.");
    expect(errorBody.data).toBeNull();
    expect(errorBody.isSuccess).toBe(false);
    expect(errorBody.errorCode).toBeNull();
    expect(errorBody.errorMsg).toBeNull();
  });


  test("Apply WFH - Missing required fields  @negative", async ({ request }) => {
    const attendance = new Attandance();
    const incompletePayload = {
      employeeId: 368,
      // Missing other required fields
    };

    const response = await attendance.applyWFH(request, incompletePayload, authToken);
   
    // Should return error for missing required fields
    expect(response).toBeTruthy();
    expect([400, 422, 500]).toContain(response.status);
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

  test("Apply WFH - Invalid employee ID  @negative", async ({ request }) => {
    const attendance = new Attandance();
    const invalidPayload = {
      ...applyWFHExpected.requestBody,
      employeeId: 999999 // Invalid employee ID
    };

    const response = await attendance.applyWFH(request, invalidPayload, authToken);
    // Should return error for invalid employee ID
    expect(response).toBeTruthy();
    expect([409]).toContain(response.status);
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

 
 test("Apply WFH - Different WFH categories  @happy", async ({ request }) => {
    const attendance = new Attandance();
    
    // Test different WFH categories
    const categories = ["ME", "OT"];
    
    for (const category of categories) {
      
      const basePayload = {
        ...applyWFHExpected.requestBody,
        reasonSelect: category,
        employeeRemark: `WFH request for ${category} reason`
      };
      
      // Use the retry function to find a working date
      const result = await tryWFHWithDifferentDates(attendance, request, basePayload);
      // Validate the result
      expect(result.success).toBe(true);
      expect(result.response.status).toBe(200);
      expect(result.response.body).toBeTruthy();
      
      // Track WFH ID for cleanup
      if (result.response.body.workFromHomeDateWiseId) {
        createdWFHIds.push(result.response.body.workFromHomeDateWiseId);
      }
      
    
    }
  });

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
});