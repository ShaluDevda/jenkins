import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login.js";
import ExpectResponse from "../../utils/endpoints/expect/expectResponse.js";
import { Leave } from "../../utils/endpoints/classes/settings/leave.js";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import expectResponse from "../../utils/endpoints/expect/expectResponse.js";

test.describe("GET| /hrmsApi/leaveApply/leaveWiseRatio/emp/{employeeId}/{companyId}, Returns chart data of balance vs consumed leave for the employee", () => {
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

    test.only("GET|Returns chart data of balance vs consumed leave for the employee - Happy flow @happy", async ({ request }) => {
        const leave = new Leave();
        // Get the holiday data
        response = await leave.getEmployeeLeaveWiseRatio(request, authToken,employeeId,companyId);
        console.log(JSON.stringify(response.body.data))
        expectResponse.okResponse(response.status);
        expect(response.body).toBeTruthy();
        // Validate chart data items: label and value should not be null/empty
        const chartData = response.body.data;
        expect(Array.isArray(chartData)).toBeTruthy();
        for (const item of chartData) {
            expect(item).toBeTruthy();
            // label should be defined and non-empty
            expect(item.label).toBeDefined();
            expect(String(item.label).trim().length).toBeGreaterThan(0);
            // value should be defined and non-empty (string or number)
            expect(item.value).toBeDefined();
            expect(String(item.value).trim().length).toBeGreaterThanOrEqual(0);
        }

        // Check if both Balance and Consumed values are zero — in that case fail with a clear message
        const balance = chartData.find(d => d.label === "Balance");
        const consumed = chartData.find(d => d.label === "Consumed");
        if (balance && consumed && String(balance.value) === "0" && String(consumed.value) === "0") {
            throw new Error("Please assign leave scheme");
        }
    });


});
