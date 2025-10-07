import endpoints from "../../../../fixtures/Endpoints/Attandance.json" assert { type: "json" };
import hrmsApi from "../../../../fixtures/Endpoints/commonEndpoint.json" assert { type: "json" };
import { getDynamicEncodedDateString } from "../general/commonMethod";
import inputsData from "../../../../fixtures/inputs.json" assert { type: "json" };
class liveAttendance {
  async getAllLateComersListByDate(request, token, payload) {
    const dynamicDate = getDynamicEncodedDateString(); // <-- Call the function
    const url =
      hrmsApi.hrmsApi + endpoints.getAllLateComersListByDate + dynamicDate;
    const response = await request.post(url, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        userName: inputsData.username,
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
    const dynamicDate = getDynamicEncodedDateString(); // <-- Call the function
    const url =
      hrmsApi.hrmsApi + endpoints.getAllLateComersListByDateCount + dynamicDate;
    const response = await request.post(url, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        userName: inputsData.username,
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

  async getAllAbsentListByDate(request, token, payload) {
    const dynamicDate = getDynamicEncodedDateString(); // <-- Call the function
    const url =
      hrmsApi.hrmsApi + endpoints.getAllAbsentListByDate + dynamicDate;
    const response = await request.post(url, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        userName: inputsData.username,
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
    const dynamicDate = getDynamicEncodedDateString(); // <-- Call the function
    const url =
      hrmsApi.hrmsApi + endpoints.getAllAbsentListByDateCount + dynamicDate;
    const response = await request.post(url, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        userName: inputsData.username,
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
  async getAllPresentListByDate(request, token, payload) {
    const dynamicDate = getDynamicEncodedDateString(); // <-- Call the function
    const url =
      hrmsApi.hrmsApi + endpoints.getAllPresentListByDate + dynamicDate;
    const response = await request.post(url, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        userName: inputsData.username,
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

  async getAllPresentListByDateCount(request, token, payload) {
    const dynamicDate = getDynamicEncodedDateString(); // <-- Call the function
    const url =
      hrmsApi.hrmsApi + endpoints.getAllPresentListByDateCount + dynamicDate;
    const response = await request.post(url, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        userName: inputsData.username,
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
  async allEmployeesLeaveToday(request, token, payload) {
    const dynamicDate = getDynamicEncodedDateString(); // <-- Call the function
    const url = hrmsApi.hrmsApi + endpoints.allEmployeesLeaveToday;
    const response = await request.post(url, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        userName: inputsData.username,
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
  async allEmpLeaveTodayCount(request, token, payload) {
    const dynamicDate = getDynamicEncodedDateString(); // <-- Call the function
    const url = hrmsApi.hrmsApi + endpoints.allEmpLeaveTodayCount;
    const response = await request.post(url, {
      method: "POST",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: inputsData.tenantId,
        userName: inputsData.username,
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
  
   async currentAttendanceReport(request, tenantId, token) {
    const dynamicDate = getDynamicEncodedDateString(); // <-- Call the function
    // Add tenantId as query param, dynamic
    const url = hrmsApi.hrmsApi + endpoints.currentAttendanceReport +dynamicDate+ `?tenantId=${tenantId}`;
    const response = await request.get(url, {
      method: "GET",
      headers: {
        "Content-Type": inputsData.ContentType,
        Authorization: `Bearer ${token}`,
        tenantId: tenantId,
        userName: inputsData.username,
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

export { liveAttendance };
