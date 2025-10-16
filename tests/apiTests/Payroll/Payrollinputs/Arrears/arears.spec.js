import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../../../utils/endpoints/classes/login";
import { extractGradeList } from "../../../../utils/endpoints/classes/general/commonMethod";
import ExpectResponse from "../../../../utils/endpoints/expect/expectResponse";
import { Arears } from "../../../../utils/endpoints/classes/Payroll/PayrollInputs/Arrears/Arears";
import loginExpected from "../../../../fixtures/Response/loginExpected.json" assert { type: "json" };


test.describe("GET| arear/{companyId}, View arears", () => {
  let authToken, response, arrears, companyId;

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
    companyId = loginResponse.body.companyId;

  });

  test("View arears - Happy flow @happy", async ({ request }) => {
    arrears = new Arears();
    response = await arrears.arear(request, authToken, companyId);
    ;
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);
    expect(Array.isArray(response.body)).toBe(true);

    // Validate each designation object
    const ids = new Set();
    for (const item of response.body) {
      expect(item).toHaveProperty("arearCalculationId");
      expect(item).toHaveProperty("actualAmount");
      expect(item).toHaveProperty("companyId");
      expect(item).toHaveProperty("dateCreated");
      expect(item).toHaveProperty("dateUpdated");
      expect(item).toHaveProperty("netPayableAmount");
      expect(item).toHaveProperty("payrollMonth");
      expect(item).toHaveProperty("pfDeduction");
      expect(item).toHaveProperty("employeeId");
      expect(item).toHaveProperty("userId");
      expect(item).toHaveProperty("isBooked");
      expect(item).toHaveProperty("userIdUpdate");
      expect(item).toHaveProperty("arearId");
      expect(item).toHaveProperty("arearFrom");
      expect(item).toHaveProperty("esiDeduction");
      expect(item).toHaveProperty("employeeCode");
      expect(item).toHaveProperty("empName");
      expect(item).toHaveProperty("departmentName");
      expect(item).toHaveProperty("deductionAmt");
      expect(item).toHaveProperty("arearTo");
      expect(item).toHaveProperty("dateOfJoining");
      expect(item).toHaveProperty("designationName");
      expect(item).toHaveProperty("gradesName");
      expect(item).toHaveProperty("basicSalary");
      expect(item).toHaveProperty("specialAllowance");
      expect(item).toHaveProperty("employeeLogoPath");
      expect(item).toHaveProperty("ptDeduction");
    }

    const gradeList = extractGradeList(response.body);

  });

  test("Get Grade list without companyId - @negative", async ({ request }) => {
    arrears = new Arears();
    response = await arrears.arear(request, authToken);
    console.log(response);
    ExpectResponse.internalServerError(response.status);
    ExpectResponse.serverNotResponding(response.body.message);
  });

});
