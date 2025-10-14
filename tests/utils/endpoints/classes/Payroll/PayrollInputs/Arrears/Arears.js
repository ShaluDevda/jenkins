import endpoints from "../../../../../../fixtures/Endpoints/Payroll.json" assert { type: "json" };
import hrmsApi from "../../../../../../fixtures/Endpoints/commonEndpoint.json" assert { type: "json" };
import inputsData from "../../../../../../fixtures/inputs.json" assert { type: "json" };


class Arears {
  async arear(request, token, companyId) {
    const url = `${hrmsApi.hrmsApi}${endpoints.arear}${companyId}`;
    const response = await request.get(url, {
      method: "GET",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
      },
    });

    try {
      const responseBody = await response.json();
      return {
        status: response.status(),
        body: responseBody,
      };
    } catch (error) {
      const responseText = await response.text();
      return {
        status: response.status(),
        body: responseText || {},
        error: error.message,
      };
    }
  }

    async saveData(request, token, payload) {
    const url = `${hrmsApi.hrmsApi}${endpoints.saveData}`;
    const response = await request.post(url, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        username: inputsData.username,

      },
      data: payload,
    });

    try {
      const responseBody = await response.json();
      return {
        status: response.status(),
        body: responseBody,
      };
    } catch (error) {
      const responseText = await response.text();
      return {
        status: response.status(),
        body: responseText || {},
        error: error.message,
      };
    }
  }

}

export { Arears };

