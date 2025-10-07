import endpoints from "../../../../fixtures/Endpoints/Attandance.json" assert { type: "json" };
import hrmsApi from "../../../../fixtures/Endpoints/commonEndpoint.json" assert { type: "json" };

import inputsData from "../../../../fixtures/inputs.json" assert { type: "json" };


class PunchTime {
  /**
   * Get punch time details for a specific employee
   * @param {Object} request - Playwright request object
   * @param {string} token - Authentication token
   * @param {string} employeeCode - Employee code (e.g., "FABHR-537-fabhrdemo.in")
   * @param {number} companyId - Company ID
   * @returns {Object} Response object with status and body
   */
  async getPunchTimeDetails(request, token, employeeCode, companyId) {
    const url = `${hrmsApi.hrmsApi}${endpoints.punchTime}/${employeeCode}/${companyId}`;
    const response = await request.get(url, {
      method: "GET",
      headers: {
        "Content-Type": inputsData.ContentType,
        "Authorization": `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        username: employeeCode,
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

  /**
   * Get punch time details without authentication token
   * @param {Object} request - Playwright request object
   * @param {string} employeeCode - Employee code
   * @param {number} companyId - Company ID
   * @returns {Object} Response object with status and body
   */
  async getPunchTimeDetailsWithoutToken(request, employeeCode, companyId) {
    const url = `${endpoints.punchTime}/${employeeCode}/${companyId}`;
    
    const response = await request.get(url, {
      method: "GET",
      headers: {
        "Content-Type":inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: employeeCode,
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

  /**
   * Get punch time details without username header
   * @param {Object} request - Playwright request object
   * @param {string} token - Authentication token
   * @param {string} employeeCode - Employee code
   * @param {number} companyId - Company ID
   * @returns {Object} Response object with status and body
   */
  async getPunchTimeDetailsWithoutUsername(request, token, employeeCode, companyId) {
    const url = `${hrmsApi.hrmsApi}${endpoints.punchTime}/${employeeCode}/${companyId}`;
    
    const response = await request.get(url, {
      method: "GET",
      headers: {
        "Content-Type": inputsData.ContentType,
        "Authorization": `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        // username header intentionally omitted for negative testing
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


  /**
   * Get punch time details with invalid company ID
   * @param {Object} request - Playwright request object
   * @param {string} token - Authentication token
   * @param {string} employeeCode - Employee code
   * @param {number} invalidCompanyId - Invalid company ID
   * @returns {Object} Response object with status and body
   */
  async getPunchTimeDetailsWithInvalidCompany(request, token, employeeCode, invalidCompanyId) {
    const url = `${hrmsApi.hrmsApi}${endpoints.punchTime}/${employeeCode}/${invalidCompanyId}`;
    
    const response = await request.get(url, {
      method: "GET",
      headers: {
        "Content-Type": inputsData.ContentType,
        "Authorization": `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        username: employeeCode,
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
}

export { PunchTime };
