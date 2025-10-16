import { test, expect, request } from "@playwright/test";
import { LoginPage } from "../../../../utils/endpoints/classes/login";
import ExpectResponse from "../../../../utils/endpoints/expect/expectResponse";
import { Arears } from "../../../../utils/endpoints/classes/Payroll/PayrollInputs/Arrears/Arears";
import loginExpected from "../../../../fixtures/Response/loginExpected.json" assert { type: "json" };


test.describe("POST| /arear/saveData/secure, Save Data", () => {
  let authToken, response;

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
  });

  test("Arear Save Data  - Happy flow @happy", async ({ request }) => {
    const payload = {
      "payload": "U2FsdGVkX19JLC4qUan5aTjY4wjRzp8xnZrFbqbLml7ytvZ/ALVcnh8ZBY3+EBEULnYHWH8dRP948k2hhj/h6mSWBVWS7T3peTEJBhqijgEvjkB+BMgb+JxhJY+LIrChNekwEQOSYsLWi7wfPBYFonDBUZileSPX2yoQMGeufj2IuVrFVLK+SyIV+VzZvxMga+8pZr8dSIvzVhxGcAURXPPy3tIn/+Osmk6JmsHy0HewLPsl4usImv/s2Wi1ZjnznvrYRydY426oxL1QdtWMrkGjd5vbrHqqL7lMjh0DEWCO+ghO2Fca1CqzVncBq2xo4Mj6svzC8p96kLc+3UM696AZvAJMQ8xMUAZIB5HcV6Adsv/RddhcNWbTeg34+TPj1nFnu73660u82GJ0ZiHNTJkIY+RVEvxDtV55x9W6jes=",
      "client": "web"
    }
    const arears = new Arears();
    response = await arears.saveData(request, authToken, payload);
    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);

    // Validate after creating branch
    response = await arears.saveData(request, authToken);

    expect(response).toBeTruthy();
    ExpectResponse.okResponse(response.status);

  });

});
