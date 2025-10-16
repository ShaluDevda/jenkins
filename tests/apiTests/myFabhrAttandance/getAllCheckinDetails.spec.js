import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import { ResponseValidator } from "../../utils/validation/responseValidator";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };

test.describe("Get All Checkin Detail", () => {
<<<<<<< HEAD
  let token, employeeId, userName;
=======
  let token,employeeId;
>>>>>>> ParthMantri
  const loginBody = {
    username: loginExpected.happy.loginName,
    password: loginExpected.happy.password,
  };

<<<<<<< HEAD
  test.beforeEach("GET |-/hrmsApi/attendanceLog/getAllCheckInDetails/emp/{employeeId}  Get authentication token", async ({ request }) => {
=======
  test.beforeEach("GET |-hrmsApi/attendanceLog/getAllCheckInDetails/emp/{employeeId}  Get authentication token", async ({ request }) => {
>>>>>>> ParthMantri
    const loginPage = new LoginPage();
    const loginResp = await loginPage.loginAs(request, loginBody);
    token = loginResp.body.token;
    employeeId = loginResp.body.employeeId;
<<<<<<< HEAD
    userName = loginResp.body.userName;
=======
>>>>>>> ParthMantri
    expect(token).toBeTruthy();
  });

  test("Get all checkin data @happy", async ({ request }) => {
    const getAllCheckinDetails = new Attandance();
<<<<<<< HEAD
    const response = await getAllCheckinDetails.getAllCheckinDetails(
      request,
      token,
      employeeId
    );
=======
    const response = await getAllCheckinDetails.getAllCheckinDetails(request, token, employeeId);
>>>>>>> ParthMantri


    // Basic response validation
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    expect(Array.isArray(response.body)).toBe(true);

    // Validate response structure using common validator
    const validationResult = ResponseValidator.validateAttendanceResponse(
      response,
      200
    );
    expect(validationResult.isValid).toBe(true);

    // Additional specific assertions
    if (response.body.length > 0) {
      const firstRecord = response.body[0];

      // Validate first record structure
      expect(firstRecord).toHaveProperty("empId");
      expect(firstRecord).toHaveProperty("userName");
      expect(firstRecord).toHaveProperty("checkInTime");
      expect(firstRecord).toHaveProperty("in_out");
      expect(firstRecord).toHaveProperty("modeCode");
      expect(firstRecord).toHaveProperty("date");

      // Validate data types
      expect(typeof firstRecord.empId).toBe("number");
      expect(typeof firstRecord.userName).toBe("string");
      expect(typeof firstRecord.checkInTime).toBe("string");
      expect(typeof firstRecord.date).toBe("number");

      // Validate specific values
      expect(firstRecord.empId).toBe(employeeId);
      expect(firstRecord.userName).toBe(userName);
      expect(["in", "out", "ou"]).toContain(firstRecord.in_out);
      expect(["W", "M", "A"]).toContain(firstRecord.modeCode);

      // Validate time format (should contain AM/PM)
      expect(firstRecord.checkInTime).toMatch(/\d{1,2}:\d{2}:\d{2}\s?(AM|PM)/i);
    }
  });

  test("Get all checkin data - Negative scenario without username @negative", async ({
    request,
  }) => {
    const getAllCheckinDetails = new Attandance();
    const response =
      await getAllCheckinDetails.getAllCheckinDetailsWithoutUsername(
        request,
        token,
<<<<<<< HEAD
        employeeId
=======
        companyId
>>>>>>> ParthMantri
      );

    // Validate error response structure
    expect(response).toBeTruthy();

    // Specific error response assertions
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("isSuccess");
    expect(response.body).toHaveProperty("errorCode");
    expect(response.body).toHaveProperty("errorMsg");

    // Validate error response values
    ExpectResponse.forbiddenRequest(response.status);
    ExpectResponse.invalidAccess(response.body.message);
    expect(response.body.data).toBeNull();
    expect(response.body.isSuccess).toBe(false);
    expect(response.body.errorCode).toBeNull();
    expect(response.body.errorMsg).toBeNull();
  });

  test("Get all checkin data - Negative scenario without tenantid and token @negative", async ({
    request,
  }) => {
    const getAllCheckinDetails = new Attandance();
    const response =
      await getAllCheckinDetails.getAllCheckinDetailsWithouttenantid(
        request, null, employeeId
      );
    console.log(response.body)
    // Validate error response structure
    expect(response).toBeTruthy();

    // Specific error response assertions
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("isSuccess");

    // Validate error response values
    ExpectResponse.unauthorizedRequest(response.status);
    ExpectResponse.inCorrectUsername(response.body.message);
    expect(response.body.data).toBeNull();
    expect(response.body.isSuccess).toBe(false);

  });
  test.only("Get all checkin data - Negative scenario without employeeId @negative", async ({
    request,
  }) => {
    const getAllCheckinDetails = new Attandance();
    const response = await getAllCheckinDetails.getAllCheckinDetails(
      request,
      token
    );
    console.log(response.body)
    // Validate error response structure
    expect(response).toBeTruthy();

    // Specific error response assertions
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("isSuccess");

    // Validate error response values
    ExpectResponse.unauthorizedRequest(response.status);
    ExpectResponse.inCorrectUsername(response.body.message);
    expect(response.body.data).toBeNull();
    expect(response.body.isSuccess).toBe(false);

  });
});
