import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import applyARExpected from "../../fixtures/Response/applyARExpected.json" assert { type: "json" };
import rejectPayload from "../../fixtures/payloads/rejectAndApproveAr.json" assert { type: "json" };

test.describe("POST| -/hrmsApi/attendanceregularizationrequest,   Apply AR (Attendance Regularization) API", () => {
  let authToken,firstResponsebody;

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

  test("Apply AR -  Success scenario @happy", async ({ request }) => {
    const attendance = new Attandance();
    let response;
    let attempts = 0;
    let status = 0;

    do {
      // Generate a new date for each attempt (today - attempts days, always before today)
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - attempts); // Go back in time
      const isoDate = date.toISOString();

      // Ensure the date is before today (not today or future)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date.getTime() >= today.getTime()) {
        attempts++;
        continue; // Skip if not before today
      }

      const dynamicPayload = {
        ...applyARExpected.requestBody,
        fromDate: isoDate,
        toDate: isoDate,
      };
      response = await attendance.applyAR(request, dynamicPayload, authToken);
     
      attempts++;
      // Defensive: If response is undefined/null, break to avoid infinite loop
      if (!response || typeof response.status !== "number") {
        break;
      }
      status = response.status;
      // If response is not 200, check message
      if (status !== 200 && response.body?.message) {
        const msg = response.body.message;
        if (
          msg === applyARExpected.failure.alreadyApplyLeave ||
          msg === applyARExpected.failure.message
        ) {
          // Allowed to retry
        } else {
          // Not allowed, break loop to fail below
          break;
        }
      }
      if (status === 200) break;
      await new Promise((res) => setTimeout(res, 500));
    } while (status !== 200);

    // Defensive: If response is undefined/null, throw error
    if (!response || typeof response.status !== "number") {
      throw new Error("No valid response received from applyAR API.");
    }

    const responseBody = response.body;
    // If not 200 and not allowed retry message, fail here
    if (
      response.status !== 200 &&
      responseBody?.message !== applyARExpected.failure.alreadyApplyLeave &&
      responseBody?.message !== applyARExpected.failure.message
    ) {
      throw new Error(
        `Unexpected error message after ${attempts} attempts: ${responseBody?.message}. Test failed.`
      );
    }

    // Assert only if we got a 200, else fail
    expect(response.status).toBe(200);
    expect(responseBody.statusCode).toBe(applyARExpected.success.statusCode);
    expect(responseBody.message).toBe(applyARExpected.success.message);
    expect(responseBody.isSuccess).toBe(applyARExpected.success.isSuccess);
    expect(responseBody.data).toBeDefined();
    expect(responseBody.data.arID).toBeDefined();
    expect(responseBody.data.arCategory).toBe(
      applyARExpected.requestBody.arCategory
    );
    expect(responseBody.data.days).toBe(applyARExpected.requestBody.days);
    expect(responseBody.data.employeeRemark).toBe(
      applyARExpected.requestBody.employeeRemark
    );
    expect(responseBody.data.status).toBe(applyARExpected.requestBody.status);

    // Step 2: Construct the rejection payload from the application response
    const rejectionPayload = {
      ...rejectPayload.rejectApproveAr,
      arID: responseBody.data.arID,
      arCategory: responseBody.data.arCategory,
      days: responseBody.data.days,
      fromDate: responseBody.data.fromDate,
      toDate: responseBody.data.toDate,
      employeeRemark: responseBody.data.employeeRemark,
      status: "REJ", // Set status to Reject
      reviewerRemark: "Rejecting for testing purposes",
    };

    // Step 3: Send the rejection request to clean up
    const rejectResponse = await attendance.applyAR(
      request,
      rejectionPayload,
      authToken
    );
    expect(rejectResponse.status, "Failed to reject the created AR.").toBe(200);
  });

  test("Apply AR - Already applied scenario @happy ", async ({
    request,
  }) => {
    const attendance = new Attandance();
    // First apply AR
    const firstResponse = await attendance.applyAR(
      request,
      applyARExpected.requestBody,
      authToken
    );
    // If first request was successful, try to apply again for the same date range
    if (firstResponse.status === 200) {
      const secondResponse = await attendance.applyAR(
        request,
        applyARExpected.requestBody,
        authToken
      );
      const responseBody = secondResponse.body;

      expect(secondResponse.status).toBe(500);
      expect(responseBody.statusCode).toBe(applyARExpected.failure.statusCode);
      expect(responseBody.message).toBe(applyARExpected.failure.message);
      expect(responseBody.isSuccess).toBe(applyARExpected.failure.isSuccess);
      expect(responseBody.data).toBeNull();

      // Clean up the initially created AR by rejecting it
      const firstResponseBody = firstResponse.body;

    }
    else {
       firstResponsebody = firstResponse.body;
      expect(firstResponsebody.statusCode).toBe(applyARExpected.failure.statusCode);
      expect(firstResponsebody.message).toBe(applyARExpected.failure.message);
      expect(firstResponsebody.isSuccess).toBe(applyARExpected.failure.isSuccess);
      expect(firstResponsebody.data).toBeNull();

    }
    const rejectionPayload = {
      ...rejectPayload.rejectApproveAr,
      arID: firstResponsebody.data.arID,
      arCategory: firstResponsebody.data.arCategory,
      days: firstResponsebody.data.days,
      fromDate: firstResponsebody.data.fromDate,
      toDate: firstResponsebody.data.toDate,
      employeeRemark: firstResponsebody.data.employeeRemark,
      status: "REJ", // Set status to Reject
      reviewerRemark: "Rejecting for cleanup purposes",
    };
    const rejectResponse = await attendance.applyAR(
      request,
      rejectionPayload,
      authToken
    );
    expect(
      rejectResponse.status,
      "Cleanup failed: Could not reject the initial AR."
    ).toBe(200);
  });

  test("Apply AR - Invalid request body  @negative", async ({
    request,
  }) => {
    const attendance = new Attandance();
    const invalidRequestBody = {
      ...applyARExpected.requestBody,
      arCategory: "", // Invalid empty category
      days: -1, // Invalid negative days
    };

    const response = await attendance.applyAR(
      request,
      invalidRequestBody,
      authToken
    );
    const responseBody = response.body;

    // Should return an error for invalid request
    expect(response.status).not.toBe(200);
    expect(responseBody.isSuccess).toBe(false);
  });

  test("Apply AR - Without authentication token  @negative", async ({
    request,
  }) => {
    const attendance = new Attandance();
    const response = await attendance.applyAR(
      request,
      applyARExpected.requestBody
    ); // No token passed
    const responseBody = response.body;

    // Should return an error for missing authentication
    expect(response.status).not.toBe(200);
    expect(responseBody.isSuccess).toBe(false);
  });
});
