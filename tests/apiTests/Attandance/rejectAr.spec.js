import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import applyARExpected from "../../fixtures/Response/applyARExpected.json" assert { type: "json" };
import rejectPayload from "../../fixtures/payloads/rejectAndApproveAr.json" assert { type: "json" };
test.describe("Apply AR (Attendance Regularization) API", () => {
  let authToken;

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

  test("Apply AR and Reject-  Success scenario  @happy", async ({ request }) => {
   
    const attendance = new Attandance();
    let response;
    let attempts = 0;
    const maxAttempts = 60;
    do {
       // Generate a new date for each attempt (today + attempts days)
    const date = new Date();
    date.setDate(date.getDate() + attempts);
    date.setHours(0, 0, 0, 0);
    const isoDate = date.toISOString();
    const dynamicPayload = {
      ...applyARExpected.requestBody,
      fromDate: isoDate,
      toDate: isoDate
    };
      response = await attendance.applyAR(request, dynamicPayload, authToken);
      attempts++;
      if (response.status === 200) break;
      // Optional: wait a bit before retrying
      await new Promise(res => setTimeout(res, 500));
    } while (response.status !== 200 && attempts < maxAttempts);

    const responseBody = response.body;
    // Assert only if we got a 200, else fail
    expect(response.status).toBe(200);
  //reject AR payload
 const Payload={
    ...rejectPayload.rejectApproveAr,
    arID: responseBody.data.arID,
    arCategory: responseBody.data.arCategory,
    days: responseBody.data.days,
    fromDate: responseBody.data.fromDate,
    toDate: responseBody.data.toDate,
    employeeRemark: responseBody.data.employeeRemark,
    status: "REJ",
    reviewerRemark: "Rejecting for testing purpose",
    approvalId: responseBody.data.approvalId,
    companyId: responseBody.data.companyId,
    companyIdUpdate: responseBody.data.companyIdUpdate,
    userIdUpdate: responseBody.data.userIdUpdate,
    userId: responseBody.data.userId,
    employeeId: responseBody.data.employeeId
  }
    //reject AR
   let rejectResponse = await attendance.applyAR(request,Payload, authToken);
   expect(rejectResponse.status).toBe(200);
   expect(rejectResponse.body.statusCode).toBe(200);
   expect(rejectResponse.body.isSuccess).toBe(true);
   expect(rejectResponse.body.message).toBe("Data Found Successfully");
  });
  test("Apply AR and Approve-  Success scenario  @happy", async ({ request }) => {
    const attendance = new Attandance();
    let response;
    let attempts = 0;
    const maxAttempts = 19;
    do {
       // Generate a new date for each attempt (today + attempts days)
    const date = new Date();
    date.setDate(date.getDate() + attempts);
    date.setHours(0, 0, 0, 0);
    const isoDate = date.toISOString();
    const dynamicPayload = {
      ...applyARExpected.requestBody,
      fromDate: isoDate,
      toDate: isoDate
    };
      response = await attendance.applyAR(request, dynamicPayload, authToken);
      attempts++;
      if (response.status === 200) break;
      // Optional: wait a bit before retrying
      await new Promise(res => setTimeout(res, 500));
    } while (response.status !== 200 && attempts < maxAttempts);

    const responseBody = response.body;

    // Assert only if we got a 200, else fail
    expect(response.status).toBe(200);
  //reject AR payload
 const Payload={
    ...rejectPayload.rejectApproveAr,
    arID: responseBody.data.arID,
    arCategory: responseBody.data.arCategory,
    days: responseBody.data.days,
    fromDate: responseBody.data.fromDate,
    toDate: responseBody.data.toDate,
    employeeRemark: responseBody.data.employeeRemark,
    status: "APR",
    reviewerRemark: "Approve for testing purpose",
    approvalId: responseBody.data.approvalId,
    companyId: responseBody.data.companyId,
    companyIdUpdate: responseBody.data.companyIdUpdate,
    userIdUpdate: responseBody.data.userIdUpdate,
    userId: responseBody.data.userId,
    employeeId: responseBody.data.employeeId
  }
    //Approval AR
   let rejectResponse = await attendance.applyAR(request,Payload, authToken);
   expect(rejectResponse.status).toBe(200);
   expect(rejectResponse.body.statusCode).toBe(200);
   expect(rejectResponse.body.isSuccess).toBe(true);
   expect(rejectResponse.body.message).toBe("Data Found Successfully");
  });

  test("Apply AR and Approve and than cancel -  Success scenario  @happy", async ({ request }) => {
   // @priority: medium
   // @happy
    const attendance = new Attandance();
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
      toDate: isoDate
    };
      response = await attendance.applyAR(request, dynamicPayload, authToken);
      attempts++;
      if (response.status === 200) break;
      // Optional: wait a bit before retrying
      await new Promise(res => setTimeout(res, 500));
    } while (response.status !== 200 && attempts < maxAttempts);

    const responseBody = response.body;
    // Assert only if we got a 200, else fail
    expect(response.status).toBe(200);
  //reject AR payload
 const Payload={
    ...rejectPayload.rejectApproveAr,
    arID: responseBody.data.arID,
    arCategory: responseBody.data.arCategory,
    days: responseBody.data.days,
    fromDate: responseBody.data.fromDate,
    toDate: responseBody.data.toDate,
    employeeRemark: responseBody.data.employeeRemark,
    status: "APR",
    reviewerRemark: "Approve for testing purpose",
    approvalId: responseBody.data.approvalId,
    companyId: responseBody.data.companyId,
    companyIdUpdate: responseBody.data.companyIdUpdate,
    userIdUpdate: responseBody.data.userIdUpdate,
    userId: responseBody.data.userId,
    employeeId: responseBody.data.employeeId
  }
    //Approval AR
   let rejectResponse = await attendance.applyAR(request,Payload, authToken);
   expect(rejectResponse.status).toBe(200);
   expect(rejectResponse.body.statusCode).toBe(200);
   expect(rejectResponse.body.isSuccess).toBe(true);
   expect(rejectResponse.body.message).toBe("Data Found Successfully");

   //cancel AR payload
   let cancelPayload={
    ...Payload,
    status: "CAN",
    statusValue:"Approved"
   }
      let cancelResponse = await attendance.applyAR(request,cancelPayload, authToken);
      expect(cancelResponse.status).toBe(200);
      expect(cancelResponse.body.statusCode).toBe(200);
      expect(cancelResponse.body.isSuccess).toBe(true);
      expect(cancelResponse.body.message).toBe("Data Found Successfully");
      expect(cancelResponse.body.data.status).toBe("CAN");

  });
 



  
});
