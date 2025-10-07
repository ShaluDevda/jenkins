/**
 * Common validation class for API responses
 * Provides reusable validation methods for different response types
 */
export class ResponseValidator {
  /**
   * Validates basic response structure
   * @param {Object} response - The response object
   * @param {number} expectedStatus - Expected HTTP status code
   * @returns {Object} Validation result
   */
  static validateBasicResponse(response, expectedStatus = 200) {
    const result = {
      isValid: true,
      errors: []
    };

    // Check if response exists
    if (!response) {
      result.isValid = false;
      result.errors.push('Response is null or undefined');
      return result;
    }

    // Check status code
    if (response.status !== expectedStatus) {
      result.isValid = false;
      result.errors.push(`Expected status ${expectedStatus}, got ${response.status}`);
    }

    // Check if body exists
    if (!response.body) {
      result.isValid = false;
      result.errors.push('Response body is missing');
    }

    return result;
  }

  /**
   * Validates array response structure
   * @param {Object} response - The response object
   * @param {number} expectedStatus - Expected HTTP status code
   * @param {number} minLength - Minimum array length
   * @returns {Object} Validation result
   */
  static validateArrayResponse(response, expectedStatus = 200, minLength = 0) {
    const basicValidation = this.validateBasicResponse(response, expectedStatus);
    
    if (!basicValidation.isValid) {
      return basicValidation;
    }

    // Check if body is an array
    if (!Array.isArray(response.body)) {
      basicValidation.isValid = false;
      basicValidation.errors.push('Response body is not an array');
      return basicValidation;
    }

    // Check array length
    if (response.body.length < minLength) {
      basicValidation.isValid = false;
      basicValidation.errors.push(`Expected at least ${minLength} items, got ${response.body.length}`);
    }

    return basicValidation;
  }

  /**
   * Validates attendance record structure
   * @param {Object} attendanceRecord - Single attendance record
   * @returns {Object} Validation result
   */
  static validateAttendanceRecord(attendanceRecord) {
    const result = {
      isValid: true,
      errors: []
    };

    const requiredFields = [
      'offset', 'limit', 'pageNo', 'noOfEmi', 'positionId', 
      'pageSize', 'mode', 'date', 'userName', 'empId', 
      'checkInTime', 'modeCode', 'in_out'
    ];

    // Check required fields
    for (const field of requiredFields) {
      if (!(field in attendanceRecord)) {
        result.isValid = false;
        result.errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate field types and values
    if (attendanceRecord.empId && typeof attendanceRecord.empId !== 'number') {
      result.isValid = false;
      result.errors.push('empId should be a number');
    }

    if (attendanceRecord.date && typeof attendanceRecord.date !== 'number') {
      result.isValid = false;
      result.errors.push('date should be a number (timestamp)');
    }

    if (attendanceRecord.userName && typeof attendanceRecord.userName !== 'string') {
      result.isValid = false;
      result.errors.push('userName should be a string');
    }

    if (attendanceRecord.checkInTime && typeof attendanceRecord.checkInTime !== 'string') {
      result.isValid = false;
      result.errors.push('checkInTime should be a string');
    }

    if (attendanceRecord.in_out && !['in', 'out', 'ou'].includes(attendanceRecord.in_out)) {
      result.isValid = false;
      result.errors.push('in_out should be "in", "out", or "ou"');
    }

    if (attendanceRecord.modeCode && !['W', 'M', 'A'].includes(attendanceRecord.modeCode)) {
      result.isValid = false;
      result.errors.push('modeCode should be "W" (Web), "M" (Mobile), or "A" (App)');
    }

    return result;
  }

  /**
   * Validates attendance data response
   * @param {Object} response - The response object
   * @param {number} expectedStatus - Expected HTTP status code
   * @returns {Object} Validation result
   */
  static validateAttendanceResponse(response, expectedStatus = 200) {
    const arrayValidation = this.validateArrayResponse(response, expectedStatus);
    
    if (!arrayValidation.isValid) {
      return arrayValidation;
    }

    // Validate each attendance record
    for (let i = 0; i < response.body.length; i++) {
      const recordValidation = this.validateAttendanceRecord(response.body[i]);
      if (!recordValidation.isValid) {
        arrayValidation.isValid = false;
        arrayValidation.errors.push(`Record ${i}: ${recordValidation.errors.join(', ')}`);
      }
    }

    return arrayValidation;
  }

  /**
   * Validates login response structure
   * @param {Object} response - The response object
   * @param {number} expectedStatus - Expected HTTP status code
   * @returns {Object} Validation result
   */
  static validateLoginResponse(response, expectedStatus = 200) {
    const basicValidation = this.validateBasicResponse(response, expectedStatus);
    
    if (!basicValidation.isValid) {
      return basicValidation;
    }

    // Check for token in response
    if (!response.body.token) {
      basicValidation.isValid = false;
      basicValidation.errors.push('Token is missing from login response');
    }

    if (response.body.token && typeof response.body.token !== 'string') {
      basicValidation.isValid = false;
      basicValidation.errors.push('Token should be a string');
    }

    return basicValidation;
  }

  
  static validateAuthErrorResponse(response, expectedStatus = 401) {
    const basicValidation = this.validateBasicResponse(response, expectedStatus);
    
    if (!basicValidation.isValid) {
      return basicValidation;
    }

    // Check for authentication error fields
    const errorFields = ['status', 'message', 'data', 'isSuccess'];
    for (const field of errorFields) {
      if (!(field in response.body)) {
        basicValidation.isValid = false;
        // basicValidation.errors.push(`Missing error field: ${field}`);
      }
    }

    if (response.body.isSuccess !== false) {
      basicValidation.isValid = false;
      basicValidation.errors.push('isSuccess should be false for error responses');
    }

    if (response.body.data !== null) {
      basicValidation.isValid = false;
      basicValidation.errors.push('data should be null for error responses');
    }

    return basicValidation;
  }

  /**
   * Helper method to throw assertion errors
   * @param {Object} validationResult - Result from validation methods
   */
  static assertValidation(validationResult) {
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
  }
}
