import endpoints from "../../../fixtures/Endpoints/commonEndpoint.json" assert { type: "json" };
import inputsData from "../../../fixtures/inputs.json" assert { type: "json" };

export class LoginPage {
  constructor() {
    this.token = null;
  }
  async  loginAs(apiContext, loginBody) {
    // const loginParams = new URLSearchParams(loginBody);
    const response = await apiContext.post(endpoints.login, {
      data: loginBody, // Automatically sets application/json
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
      },
    });
    const responseBody = await response.json();
    if (responseBody && responseBody.token) {
      this.token = responseBody.token;
    }
    return {
      status: response.status(),
      body: responseBody,
      token: this.token,
    };
  }

  async logout(apiContext) {
    const response = await apiContext.get(endpoints.logout, {
      headers: {
        tenantId: inputsData.tenantId,
        username: inputsData.username,
      },
    });
    let responseBody;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = {};
    }
    return {
      status: response.status(),
      body: responseBody,
    };
  }
}
