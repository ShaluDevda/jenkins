import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../../utils/endpoints/classes/login";
import { Loan } from "../../../../utils/endpoints/classes/Payroll/PayrollInputs/Loan/Loan";
import ExpectResponse from "../../../../utils/endpoints/expect/expectResponse";
import loginExpected from "../../../../fixtures/Response/loginExpected.json" assert { type: "json" };
import getPaginatedARPendingRequestDetailsExpected from "../../../../fixtures/Response/getPaginatedARPendingRequestDetailsExpected.json" assert { type: "json" };

let authToken, response, companyId;
let loan = new Loan();


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

test("POST| /getLoanIssueSearchListWithPagination, Get Loan Issued List - Happy flow @happy", async ({ request }) => {

 

  // First call
  response = await loan.getLoanIssueSearchListWithPagination(request, authToken, getPaginatedARPendingRequestDetailsExpected.baseRequestBody);
  expect(response).toBeTruthy();
  ExpectResponse.okResponse(response.status);

  //Second Call
  response = await loan.getLoanIssueSearchListWithPagination(request, authToken, getPaginatedARPendingRequestDetailsExpected.baseRequestBody);
  expect(response).toBeTruthy();
  ExpectResponse.okResponse(response.status);
});

test("Get Loan Issued Request Details - Invalid pagination parameters @negative", async ({ request }) => {
    const invalidRequestBody = {
      ...getPaginatedARPendingRequestDetailsExpected.baseRequestBody,
      currentPage: -1, // Invalid negative page
     
    };

    const response = await loan.getLoanIssueSearchListWithPagination(
      request,  
      authToken,
      invalidRequestBody
    );
    
    const responseBody = response.body;

    // Should return an error for invalid request
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Bad Request");
  });

  test("Get Issued Loan Details - Without authentication token @negative ", async ({ request }) => {
    const response = await loan.getLoanIssueSearchListWithPagination(
      request, 
      getPaginatedARPendingRequestDetailsExpected.baseRequestBody
    ); // No token passed
    
    const responseBody = response.body;

    // Should return an error for missing authentication
    expect(response.status).not.toBe(200);
  });

  test("Get Issued Loan Details  - Different page sizes  @happy", async ({ request }) => {
    const testCases = [
      { itemPerPage: 1, expectedMaxItems: 1 },
      { itemPerPage: 10, expectedMaxItems: 10 },
      { itemPerPage: 20, expectedMaxItems: 20 }
    ];

    for (const testCase of testCases) {
      const requestBody = {
        ...getPaginatedARPendingRequestDetailsExpected.baseRequestBody,
        itemPerPage: testCase.itemPerPage
      };
      const response = await loan.getLoanIssueSearchListWithPagination(
        request, 
        authToken,
        requestBody
      );
      
      const responseBody = response.body;

      expect(response.status).toBe(200);
      expect(responseBody.data.length).toBeLessThanOrEqual(testCase.expectedMaxItems);
      expect(responseBody.currentPage).toBe(0);
    }
  });

  test("Get Issued Loan Details  - All sorting scenarios  @happy", async ({ request }) => {
    const sortFields = ["employee", "loanNumber", "loanAmount", "deduction", "remaining"];

      for (const field of sortFields) {
        const payload = {
          ...getPaginatedARPendingRequestDetailsExpected.baseRequestBody,
          sortBy: field
        };

        const response = await loan.getLoanIssueSearchListWithPagination(
          request,
          authToken,
          payload
        );

        expect(response.status).toBe(200);
      }
});

  test("Get Issued Loan Details - Sort by all fields with ASC and DESC  @happy", async ({ request }) => {
    const sortFields = ["employee", "loanNumber", "loanAmount", "deduction", "remaining"];
    const sortDirections = ["ASC", "DESC"];
    
    for (const field of sortFields) {
      for (const direction of sortDirections) {
        const requestBody = {
          ...getPaginatedARPendingRequestDetailsExpected.baseRequestBody,
          sortBy: field,
          sortDirection: direction
        };
        
        
        const response = await loan.getLoanIssueSearchListWithPagination(
          request, 
          authToken,
          requestBody
        );
        
      }
    }
  });
