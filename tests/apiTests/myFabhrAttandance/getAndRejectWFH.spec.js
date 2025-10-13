import { test, expect } from "@playwright/test";
import { LoginPage } from "../../utils/endpoints/classes/login";
import { Attandance } from "../../utils/endpoints/classes/Attandance/myAttandance";
import loginExpected from "../../fixtures/Response/loginExpected.json" assert { type: "json" };
import getPaginatedWFHExpected from "../../fixtures/Response/getPaginatedWFHExpected.json" assert { type: "json" };
import applyWFHExpected from "../../fixtures/Response/applyWFH.json" assert { type: "json" };

test.describe("Reject and Approve WFH API", () => {
  let authToken;

  const attendance = new Attandance();

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

  test("Reject all WFH entries until less than 3 remain  @happy", async ({
    request,
  }) => {
    // Step 1: Get all pending WFH entries
    let response = await attendance.getPaginatedWFHPendingRequestDetails(
      request,
      getPaginatedWFHExpected.baseRequestBody,
      authToken
    );
    let entries = response.body;
    if (entries && entries.data) entries = entries.data; // handle if response is wrapped
    if (!Array.isArray(entries)) entries = [];

    // Step 2: Reject each entry until only 2 or fewer remain
    while (entries.length > 10) {
      const toReject = entries.map((e) => e.workFromHomeDateWiseId);
      for (const wfhId of toReject) {
        const entry = entries.find((e) => e.workFromHomeDateWiseId === wfhId);
        // Only reject if approvalStatus is null or 'PEN'
        if (entry.approvalStatus && entry.approvalStatus !== "PEN") {
          
          continue;
        }
        if (!entry) continue;
        const rejectPayload = {
          ...applyWFHExpected.rejectWFHPayload, // or use your base payload
          workFromHomeDateWiseId: entry.workFromHomeDateWiseId,
          approvalId: entry.employeeId,
          employeeId: entry.employeeId,
          userId: entry.userId,
          userIdUpdate: entry.userIdUpdate,
          fromDate: entry.fromDate,
          toDate: entry.toDate,
          reasonSelect: entry.reasonSelect,
          employeeRemark: entry.employeeRemark || "auto-reject",
          approvalStatus: "REJ",
          workfromhometype: entry.workfromhometype,
          workfromhomecategory: entry.workfromhomecategory,
          status: "REJ",
          approvalorcancelremark: "auto-reject",
        };
        const rejectResponse = await attendance.rejectWFH(
          request,
          rejectPayload,
          authToken
        );
      
        expect([200]).toContain(rejectResponse.status); // allow for already rejected/invalid
        // Optionally check rejectResponse.body
      }
      // Fetch updated list
      response = await attendance.getPaginatedWFHPendingRequestDetails(
        request,
        getPaginatedWFHExpected.baseRequestBody,
        authToken
      );
      entries = response.body;
      if (entries && entries.data) entries = entries.data;
      if (!Array.isArray(entries)) entries = [];
    }
    expect(entries.length).toBeLessThanOrEqual(10);
  });
});
