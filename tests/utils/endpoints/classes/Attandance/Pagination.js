import endpoints from "../../../../fixtures/Endpoints/commonEndpoint.json" assert { type: "json" };
import attandanceAndpoints from "../../../../fixtures/Endpoints/Attandance.json" assert { type: "json" };
import inputsData from "../../../../fixtures/inputs.json" assert { type: "json" };

class Pagination {
  async verifyPagination(apiContext, paginationBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(
      endpoints.hrmsApi+attandanceAndpoints.applyAR + endpoints.pending,
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
  async overAllApprovalsPaginatedPendingsWFH(apiContext, paginationBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(
      endpoints.hrmsApi+ attandanceAndpoints.overAllApprovalsPaginatedPendingsWFH + endpoints.Pending,
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

   async overAllApprovalsNonPaginatedPendingsWFH(apiContext, paginationBody, token) {
    const authToken = token || this.token;
    const response = await apiContext.post(
      endpoints.hrmsApi+ attandanceAndpoints.overAllApprovalsPaginatedPendingsWFH + endpoints.Nonpending,
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

export { Pagination };
