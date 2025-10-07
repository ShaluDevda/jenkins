import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import applyWFHExpected from "../../fixtures/Response/applyWFH.json" assert { type: "json" };

test.describe("Work From Home Hybrid Request API", () => {
  let authToken, response;

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
  test("Apply WFH - Happy flow @happy   ", async ({ request }) => {
    const attendance = new Attandance();
    response = await attendance.hybridWfh(
      request,
      applyWFHExpected.hybridWFHSuccessPayload,
      authToken
    );
    // Basic response validation
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    const resBody = response.body;

    // // Validate response fields
    expect(resBody).toHaveProperty("workFromHomeHybrid");
    expect(resBody).toHaveProperty("approvalId");
    expect(resBody).toHaveProperty("approvalorcancelremark");
    expect(resBody).toHaveProperty("approvalStatus");
    expect(resBody).toHaveProperty("dateCreated");
    expect(resBody).toHaveProperty("toDate");
    expect(resBody).toHaveProperty("dateUpdated");
    expect(resBody).toHaveProperty("userId");
    expect(resBody).toHaveProperty("userIdUpdate");
    expect(resBody).toHaveProperty("wfhCategory");
    expect(resBody).toHaveProperty("employeeWFHStatus");

    // Status mapping check
    expect(resBody.approvalStatus).toBe("PEN");

    //     // Step 2: Reject the WFH request
    const rejectPayload = {
      ...applyWFHExpected.hybridWFHPayloadForRej,
      userId: resBody.userId,
      userIdUpdate: resBody.userIdUpdate,
      dateCreated: new Date(resBody.dateCreated).getTime(),
      toDate: new Date(resBody.toDate).getTime(),
      reasonSelect: resBody.reasonSelect ?? "ME",
      employeeId: resBody.employeeId,
      workFromHomeHybridMasterId: resBody.workFromHomeHybridMasterId ?? "1",
      employeeRemark: resBody.employeeRemark,
    };

    const rejectResponse = await attendance.hybridWfh(
      request,
      rejectPayload,
      authToken
    );
    expect(rejectResponse.status).toBe(200);
    expect(rejectResponse.body).toBeTruthy();

    // Validate rejection response
    expect(rejectResponse.body.employeeId).toBe(resBody.employeeId);
    expect(rejectResponse.body.userIdUpdated).toBe(resBody.userIdUpdated);
    expect(rejectResponse.body.userId).toBe(resBody.userId);
    expect(rejectResponse.body.dateCreated).toBe(resBody.dateCreated);
  });
});
