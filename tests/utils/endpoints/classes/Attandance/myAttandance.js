import endpoints from "../../../../fixtures/Endpoints/commonEndpoint.json" assert { type: "json" };
import attandanceEndpoints from "../../../../fixtures/Endpoints/Attandance.json" assert { type: "json" };

import inputsData from "../../../../fixtures/inputs.json" assert { type: "json" };
let responseBody;
class Attandance {
  static getCurrentDateTime() {
    const now = new Date();

    // Format time as HH:MM:SS
    const time = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Format date as YYYY-MM-DD
    const date = now.toISOString().split("T")[0];

    // Get timestamp
    const timestamp = now.getTime();

    return {
      time: time,
      date: date,
      timestamp: timestamp,
      formattedDateTime: `${date} ${time}`,
    };
  }

  static createAttendancePayload(inOut = "in", additionalData = {}) {
    const currentDateTime = this.getCurrentDateTime();

    const basePayload = {
      punchTimeDetailsId: null,
      date: currentDateTime.date,
      flag: null,
      time: currentDateTime.time,
      hhMm: null,
      companyId: 1,
      in_out: inOut,
      sNo: null,
      tktNo: inputsData.username,
      intime: null,
      outtime: null,
      address: null,
      employeeId: 368,
      fileLocation: null,
      firstName: null,
      lastName: null,
      middleName: null,
      employeeCode: null,
    };

    // Merge with any additional data
    return { ...basePayload, ...additionalData };
  }
  async getAllCheckinDetails(request, token) {
    const response = await request.get(endpoints.hrmsApi+attandanceEndpoints.getAllCheckinData, {
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

  async getAllCheckinDetailsWithoutUsername(request, token) {
    const response = await request.get(endpoints.hrmsApi+attandanceEndpoints.getAllCheckinData, {
      method: "GET",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
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

   async getAllCheckinDetailsWithouttenantid(request) {
    const response = await request.get(endpoints.hrmsApi+attandanceEndpoints.getAllCheckinData, {
      method: "GET",
      headers: {
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

  async postWebAttendance(request, token, attendanceData) {
    const response = await request.post(endpoints.hrmsApi+attandanceEndpoints.webAttendance, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
      },
      data: attendanceData,
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
   * Apply Work From Home request
   * @param {Object} request - Playwright request object
   * @param {Object} wfhData - WFH request data
   * @param {string} token - Authentication token
   * @returns {Object} Response object with status and body
   */
  async applyWFH(request, wfhData, token) {
    const response = await request.post(endpoints.hrmsApi+attandanceEndpoints.applyWFH, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        Authorization: `Bearer ${token}`,
      },
      data: wfhData,
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
   * Apply Work From Home request without authentication token
   * @param {Object} request - Playwright request object
   * @param {Object} wfhData - WFH request data
   * @returns {Object} Response object with status and body
   */
  async applyWFHWithoutToken(request, wfhData) {
    const response = await request.post(endpoints.hrmsApi+attandanceEndpoints.applyWFH, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
      },
      data: wfhData,
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
   * Reject/Cancel Work From Home request
   * @param {Object} request - Playwright request object
   * @param {Object} rejectWFHData - WFH rejection data
   * @param {string} token - Authentication token
   * @returns {Object} Response object with status and body
   */
  async rejectWFH(request, rejectWFHData, token) {
    const response = await request.post(endpoints.hrmsApi+attandanceEndpoints.applyWFH, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        host: "hrms.fabhr.in"
      },
      data: rejectWFHData,
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

  async applyAR(apiContext, arBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.hrmsApi+attandanceEndpoints.applyAR, {
      data: arBody,
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

    try {
      responseBody = await response.json();
    } catch {
      responseBody = {};
    }

    return {
      status: response.status(),
      body: responseBody,
      url: response.url(),
      headers: response.headers(),
    };
  }

  async getPaginatedARPendingRequestDetails(apiContext, paginationBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(
      endpoints.hrmsApi+attandanceEndpoints.getPaginatedARPendingRequestDetails,
      {
        data: paginationBody,
        headers: {
          "Content-Type": inputsData.ContentType,
          tenantId: inputsData.tenantId,
          username: inputsData.username,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      }
    );

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

  async getPaginatedARNonPendingRequestDetails(
    apiContext,
    paginationBody,
    token
  ) {
    const authToken = token || this.token;
    const response = await apiContext.post(
      endpoints.hrmsApi+attandanceEndpoints.getPaginatedARNonPendingRequestDetails,
      {
        data: paginationBody,
        headers: {
          "Content-Type": inputsData.ContentType,
          tenantId: inputsData.tenantId,
          username: inputsData.username,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      }
    );

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

  async applyWFH(apiContext, wfhBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.hrmsApi+attandanceEndpoints.applyWFH, {
      data: wfhBody,
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

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
  async getPaginatedWFHPendingRequestDetails(
    apiContext,
    paginationBody,
    token
  ) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.hrmsApi+
      attandanceEndpoints.getPaginatedWFHPendingRequestDetails,
      {
        data: paginationBody,
        headers: {
          "Content-Type": inputsData.ContentType,
          tenantId: inputsData.tenantId,
          username: inputsData.username,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      }
    );

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

  async getPaginatedWFHNonPendingRequestDetails(
    apiContext,
    paginationBody,
    token
  ) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.hrmsApi+
      attandanceEndpoints.getPaginatedWFHNonPendingRequestDetails,
      {
        data: paginationBody,
        headers: {
          "Content-Type": inputsData.ContentType,
          tenantId: inputsData.tenantId,
          username: inputsData.username,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      }
    );

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

  async findAllPreviousMonthWithCurrent(request, authToken) {
    const response = await request.get(endpoints.hrmsApi+
      endpoints.findAllPreviousMonthWithCurrent,
      {
        method: "GET",
        headers: {
          "Content-Type": inputsData.ContentType,
          tenantId: inputsData.tenantId,
          username: inputsData.username,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      }
    );

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
  async getDesignation(request, authToken) {
    const response = await request.get(endpoints.hrmsApi+endpoints.getDesignation, {
      method: "GET",
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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

  async hybridWfh(apiContext, paylod, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(endpoints.hrmsApi+attandanceEndpoints.hybridWFH, {
      data: paylod,
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

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
  async getEmployeeList(apiContext, token) {
    const authToken = token || this.token;
    const response = await apiContext.get(endpoints.hrmsApi+endpoints.getEmployeeList, {
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

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

  async getAttendaneLog(apiContext, paylod, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(
      endpoints.hrmsApi + attandanceEndpoints.getAttendaneLog,
      {
        data: paylod,
        headers: {
          "Content-Type": inputsData.ContentType,
          tenantId: inputsData.tenantId,
          username: inputsData.username,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      }
    );

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

   async getattendanceReport(apiContext, token) {
    const authToken = token || this.token;
    const response = await apiContext.get(endpoints.hrmsApi+ attandanceEndpoints.getattendanceReport, {
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

    try {
      responseBody = await response.json();
    } catch {
      responseBody = {};
    }

    return {
      status: response.status(),
      body: responseBody,
       headers: response.headers(),
    };
  }
   async getLiveAttendanceLocation(apiContext, token) {
    const authToken = token || this.token;
    const response = await apiContext.get(endpoints.hrmsApi+ attandanceEndpoints.getLiveattendanceLocation, {
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

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
  async getActiveWFHEmployees(apiContext, token) {
    const authToken = token || this.token;
    const response = await apiContext.get(endpoints.hrmsApi+ attandanceEndpoints.getActiveWFHEmployees, {
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

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
   async unsuccessSyncAttendance(apiContext, token) {
    const authToken = token || this.token;
    const response = await apiContext.get(endpoints.hrmsApi+ attandanceEndpoints.unsuccessSyncAttendance, {
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

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
   async attendanceSyncViaDate(apiContext, token) {
     // Get current date in yyyy-MM-dd format (adjust as your API expects)
  const today = new Date().toISOString().split("T")[0];
    const authToken = token || this.token;
    const response = await apiContext.get(endpoints.hrmsApi+ attandanceEndpoints.attendanceSyncViaDate +today, {
      headers: {
        "Content-Type": inputsData.ContentType,
        tenantId: inputsData.tenantId,
        username: inputsData.username,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });

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

  async deactiveFlagEmployeeWise(apiContext, payload, token) {
    const authToken = token || this.token;
    const response = await apiContext.put(
      `${endpoints.hrmsApi}${attandanceEndpoints.applyWFH}${attandanceEndpoints.deactiveFlagEmployeeWise}`,
      {
        data: payload,
        headers: {
          "Content-Type": inputsData.ContentType,
          tenantId: inputsData.tenantId,
          username: inputsData.username,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      }
    );

    let responseBody;
    try {
      responseBody = await response.json();
    } catch (error) {
      responseBody = {};
    }

    return {
      status: response.status(),
      body: responseBody,
    };
  }

   async getMarkBulkAttentanceData(apiContext, payload, token) {
    const authToken = token || this.token;
    const response = await apiContext.put(
      `${endpoints.hrmsApi}${attandanceEndpoints.applyWFH}${attandanceEndpoints.deactiveFlagEmployeeWise}`,
      {
        data: payload,
        headers: {
          "Content-Type": inputsData.ContentType,
          tenantId: inputsData.tenantId,
          username: inputsData.username,
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      }
    );

    let responseBody;
    try {
      responseBody = await response.json();
    } catch (error) {
      responseBody = {};
    }

    return {
      status: response.status(),
      body: responseBody,
    };
  }

  async getAllPresentListByDateCount(request, token, payload) {
   const url = endpoints.hrmsApi + attandanceEndpoints.getAllPresentListByDateCount;
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

  async getAllAbsentListByDateCount(request, token, payload) {
    const endpoint = attandanceEndpoints.getAllAbsentListByDateCount;
    const url = endpoints.hrmsApi + endpoint;
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

  async getAllLateComersListByDateCount(request, token, payload) {
    const endpoint = attandanceEndpoints.getAllLateComersListByDateCount;
    const url = endpoints.hrmsApi + endpoint;
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
 async getMarkBulkAttentanceWithDate(request, params, token, payload) {
   const url = endpoints.hrmsApi + attandanceEndpoints.getMarkBulkAttentanceData+params;
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

  async updateAttendaceData(request, token, payload) {
   const url = endpoints.hrmsApi + attandanceEndpoints.updateAttendaceData;
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

export { Attandance };
