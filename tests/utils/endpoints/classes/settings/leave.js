import endpoints from "../../../../fixtures/Endpoints/settings.json" assert { type: "json" };
import hrmsApi from "../../../../fixtures/Endpoints/commonEndpoint.json" assert { type: "json" };
import inputsData from "../../../../fixtures/inputs.json" assert { type: "json" };

class Leave {
  async getLeavePeriodstatus(request, token, companyId) {
    const url = `${hrmsApi.hrmsApi}${endpoints.leavePeriod}${companyId}`;
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
  async leaveTypeMaster(request, token, companyId) {
    const url = `${hrmsApi.hrmsApi}${endpoints.leaveTypeMaster}${companyId}`;
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
  async getLeavePeriod(request, token, companyId) {
    const url = `${hrmsApi.hrmsApi}${endpoints.getLeavePeriod}${companyId}`;

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
  async getLeavePendingCountOfCurrentSession(request, token, companyId) {
    const url = `${hrmsApi.hrmsApi}${endpoints.getLeavePendingCountOfCurrentSession}${companyId}`;
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

  async findAllHolydays(request, token, leavePeriodId) {
    const url = `${hrmsApi.hrmsApi}${endpoints.findAllHolydays}${leavePeriodId}`;
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

  async leaveRules(request, token, leavePeriodId) {
    const url = `${hrmsApi.hrmsApi}${endpoints.leaveRules}${leavePeriodId}`;
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

  async createLeaveScheme(request, token, payload) {
    const url = `${hrmsApi.hrmsApi}${endpoints.leaveScheme}`;
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
        url: response.url()
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


  async getemployeeInfo(request, token) {
    const url = `${hrmsApi.hrmsApi}${endpoints.getEmployeInfo}`;
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


  async getHolidays(request, token) {
    const url = `${hrmsApi.hrmsApi}${endpoints.getHolodays}`;
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
  async getfindHolidayByLeavePeroid(request, token) {
    const url = `${hrmsApi.hrmsApi}${endpoints.findHolidayByLeavePeroid}`;
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

  async activeDeactiveHoliday(request, token, payload) {
    const url = `${hrmsApi.hrmsApi}${endpoints.activeDeactiveHoliday}`;
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

  
  async getfindAllLeaveScheme(request, token, leavePeriodId) {
    const url = `${hrmsApi.hrmsApi}${endpoints.leaveScheme}${hrmsApi.findAll}${leavePeriodId}`;
   console.log(url)
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
}

export { Leave };
