import { expect } from "@playwright/test";
import constants from "../../../fixtures/constant.json" assert { type: "json" };

class ExpectResponse {
  async haveProperties(body, properties) {
    expect(Object.keys(body)).toEqual(properties);
  }

  // Status codes
  async okResponse(response) {
    expect(response).toBe(200);
  }

  async createdResponse(response) {
    expect(response).toBe(201);
  }

  async logoutRequest(response) {
    expect(response).toBe(204);
  }

  async badRequest(response) {
    expect(response).toBe(400);
  }

  async unauthorizedRequest(response) {
    expect(response).toBe(401);
  }

  async forbiddenRequest(response) {
    expect(response).toBe(403);
  }

  async notFoundRequest(response) {
    expect(response).toBe(404);
  }

  async notAllowedRequest(response) {
    expect(response).toBe(405);
  }

  async internalServerError(response) {
    expect(response).toBe(500);
  }

async fieldRequired(property) {
  expect(property).toBe(constants.fieldRequired);
}

async invalidAccess(property) {
  expect(property).toBe(constants.invalidAccess);
}
async inCorrectUsername(property) {
  expect(property).toBe(constants.inCorrectUsername);
}
async badRequestMessage(property) {
  expect(property).toBe(constants.badRequest);
}

async successfullyDataFound(property) {
  expect(property).toBe(constants.successfullyDataFound);
}
}

export default new ExpectResponse();
