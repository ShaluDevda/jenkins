import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../../../utils/endpoints/classes/login";
import ExpectResponse from "../../../../utils/endpoints/expect/expectResponse";
import { Loan } from "../../../../utils/endpoints/classes/Payroll/PayrollInputs/Loan/Loan";
import loginExpected from "../../../../fixtures/Response/loginExpected.json" assert { type: "json" };
import getPaginatedARPendingRequestDetailsExpected from "../../../../fixtures/Response/getPaginatedARPendingRequestDetailsExpected.json" assert { type: "json" };



test.describe("GET| /loanIssueId/{companyId}, View Loan Issued", () => {
  let authToken, response, loan, transactionNo, responsePaginated;

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

  test("View Loan Issued - Happy flow @happy", async ({ request }) => {
     loan = new Loan();
      responsePaginated = await loan.getLoanIssueSearchListWithPagination(request, authToken ,getPaginatedARPendingRequestDetailsExpected.baseRequestBody);
      const body = responsePaginated.body.data;
      const  randomIndex = Math.floor(Math.random() * body.length);
      const randomLoan = body[randomIndex];

    response = await loan.loanIssueId(request, authToken, randomLoan.transactionNo);
    expect(response).toBeTruthy();
    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("transactionNo");
    expect(response.body).toHaveProperty("employeeId");
    expect(response.body).toHaveProperty("loanAmount");
    expect(response.body).toHaveProperty("issueDate");
    expect(response.body).toHaveProperty("noOfEmi");
    expect(response.body).toHaveProperty("rateOfInterest");
    expect(response.body).toHaveProperty("naration");
    expect(response.body).toHaveProperty("loanType");
    expect(response.body).toHaveProperty("loanTypeLabel");
    expect(response.body).toHaveProperty("interestType");
    expect(response.body).toHaveProperty("emiAmount");
    expect(response.body).toHaveProperty("emiStartDate");
    expect(response.body).toHaveProperty("transactionDate");
    expect(response.body).toHaveProperty("dateOfJoining");
    expect(response.body).toHaveProperty("employeeCode");
    expect(response.body).toHaveProperty("departmentName");
    expect(response.body).toHaveProperty("designationName");
    expect(response.body).toHaveProperty("employeeName");
    expect(response.body).toHaveProperty("flag");
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("deductionFromPayroll");
    expect(response.body).toHaveProperty("dateCreated");
    expect(response.body).toHaveProperty("activeStatus");
    expect(response.body).toHaveProperty("loanPendingAmount");
    expect(response.body).toHaveProperty("activeStatusLabel");
    expect(response.body).toHaveProperty("companyId");
    expect(response.body).toHaveProperty("userIdUpdate");
    expect(response.body).toHaveProperty("lovName");
    expect(response.body).toHaveProperty("longerestType");
    expect(response.body).toHaveProperty("gradeName");
    expect(response.body).toHaveProperty("settlementAmount");
    expect(response.body).toHaveProperty("paymentMode");
    expect(response.body).toHaveProperty("instrumentNo");
    expect(response.body).toHaveProperty("remark");
    expect(response.body).toHaveProperty("isSettlementCompleted");
    expect(response.body).toHaveProperty("remainingEmi");
    expect(response.body).toHaveProperty("totalEmiAmount");
    expect(response.body).toHaveProperty("loanStatus");
    expect(response.body).toHaveProperty("employeeLogoPath");
    expect(response.body).toHaveProperty("loanAccountNo");
    expect(response.body).toHaveProperty("actualEmi");
    expect(response.body).toHaveProperty("outStandingAmount");
    expect(response.body).toHaveProperty("loanReleasedOn");
    expect(response.body).toHaveProperty("loanRecovered");
    expect(response.body).toHaveProperty("emiDate");
    expect(response.body).toHaveProperty("loanEmisDto");
  
  });

   test("Get SubMenu list without companyId - @negative", async ({ request }) => {
    loan = new Loan();
    response = await loan.loanIssueId(request, authToken);
    ExpectResponse.serverNotResponding(response.body.message);
   
  });

});