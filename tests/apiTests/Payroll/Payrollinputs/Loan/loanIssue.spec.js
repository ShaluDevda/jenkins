import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../../utils/endpoints/classes/login";
import { Loan } from "../../../../utils/endpoints/classes/Payroll/PayrollInputs/Loan/Loan";
import ExpectResponse from "../../../../utils/endpoints/expect/expectResponse";
import loginExpected from "../../../../fixtures/Response/loginExpected.json" assert { type: "json" };
import { Attandance } from "../../../../utils/endpoints/classes/Attandance/myAttandance";

    const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate())
      const isoDate = date.toISOString()

let authToken, response, companyId, userId, employeeId, userIdUpadate;

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
    userId = loginResponse.body.userId;
    employeeId = loginResponse.body.employeeId;
    userIdUpadate = loginResponse.body.userIdUpadate;
    
  });

test.only("POST| /loanIssue, Loan Issued - Happy flow @happy", async ({ request }) => {

  const loanAmount = Math.floor(Math.random() * 10000) + 1000;
  const noOfEmi = Math.floor(Math.random() * 10) + 1;
  const emiAmount = (loanAmount / noOfEmi).toFixed(2);
  const attendance = new Attandance();
  const responseAttendance = await attendance.findAllPreviousMonthWithCurrent(
      request,
      authToken
    );
    const deductionFromPayroll = responseAttendance.body[Math.floor(Math.random() * responseAttendance.body.length)];

  const payload = {
    loanAmount: loanAmount,
    noOfEmi: noOfEmi,
    deductionFromPayroll: deductionFromPayroll,
    remark: "test",
    userId: userId,
    employeeId: employeeId,
    issueDate: isoDate,
    companyId: companyId,
    userIdUpdate: userIdUpadate,
    emiAmount: emiAmount,
  };

  const loan = new Loan();

  // First call
  response = await loan.loanIssue(request, authToken, payload);
  expect(response).toBeTruthy();
  ExpectResponse.okResponse(response.status);

  // Second call (why twice? If intentional, ensure it's correct)
  response = await loan.loanIssue(request, authToken, payload);
  expect(response).toBeTruthy();
  ExpectResponse.okResponse(response.status);
});
