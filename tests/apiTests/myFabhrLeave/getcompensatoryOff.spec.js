import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../utils/endpoints/classes/settings/leave.js";
import payload from "../../fixtures/payloads/pagination.json" assert { type: "json" };

import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import expectResponse from "../../utils/endpoints/expect/expectResponse.js";

test.describe("GET| /hrmsApi/compensatoryOff/compOffData/{compOffId}, Returns chart data of balance vs consumed leave for the employee", () => {
    let authToken, response, companyId,employeeId;

    test.beforeEach(async ({ request }) => {
        // Login to get authentication token
        const loginPage = new LoginPage();
        const loginBody = {
            username: loginExpected.happy.loginName,
            password: loginExpected.happy.password,
        };
        const loginResponse = await loginPage.loginAs(request, loginBody);
        ExpectResponse.okResponse(loginResponse.status);
        expect(loginResponse.body.token).toBeTruthy();
        authToken = loginResponse.body.token;
        employeeId = loginResponse.body.employeeId;
        companyId = loginResponse.body.companyId;
    });

    test("GET | Returns chart data of balance vs consumed leave for the employee - Happy flow @happy", async ({ request }) => {
        const leave = new Leave();
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
    console.log(JSON.stringify(response.body.data))
        response = await leave.getCompensatoryOffById(request, authToken,compOffId);
        console.log(JSON.stringify(response.body.data))
        expectResponse.okResponse(response.status);
        expect(response.body).toBeTruthy();
        // Validate chart data items: label and value should not be null/empty
              
    });


});
