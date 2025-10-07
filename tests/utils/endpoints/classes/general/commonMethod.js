// Utility to extract all designation names from designation array
export function extractDesignationNames(designationArray) {
	if (!Array.isArray(designationArray)) return [];
	return designationArray.map(item => item.designationName).filter(Boolean);
}
// Utility to extract all Employeelist 
export function extractEmployeeList(employeeArray) {
	if (!Array.isArray(employeeArray)) return [];
	return employeeArray.filter(item => item.employeeCode && item.employeeId)
        .map(item => ({
            employeeCode: item.employeeCode,
            employeeId: item.employeeId
        }));
		
	}
function getTodayISODate() {
  const today = new Date();
  // Set to 00:00:00 for consistency, or keep as is for current time
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

export function getDynamicARPayload(basePayload) {
  const todayISO = getTodayISODate();
  return {
    ...basePayload,
    fromDate: todayISO,
    toDate: todayISO
  };
 
}
 export function extractGradeList(employeeArray) {
	if (!Array.isArray(employeeArray)) return [];
	return employeeArray.filter(item => item.gradesId && item.gradesName)
        .map(item => ({
            employeeCode: item.gradesId,
            employeeId: item.gradesName
        }));
		
	}

  export function extractBranchList(employeeArray) {
	if (!Array.isArray(employeeArray)) return [];
	return employeeArray.filter(item => item.branchId && item.branchName)
        .map(item => ({
            branchId: item.branchId,
            branchName: item.branchName
        }));
		
	}
  export function extractDepartmentList(employeeArray) {
	if (!Array.isArray(employeeArray)) return [];
	return employeeArray.filter(item => item.departmentId && item.departmentCode)
        .map(item => ({
            departmentId: item.departmentId,
            departmentCode: item.departmentCode
        }));
		
	}

  export function extractDesignationList(employeeArray) {
	if (!Array.isArray(employeeArray)) return [];
	return employeeArray.filter(item => item.designationId && item.designationName)
        .map(item => ({
            designationId: item.designationId,
            designationName: item.designationName
        }));
		
	}
  export function extractBusinessunitList(employeeArray) {
	if (!Array.isArray(employeeArray)) return [];
	return employeeArray.filter(item => item.businessUnitId && item.businessUnitCode)
        .map(item => ({
            businessUnitId: item.businessUnitId,
            businessUnitCode: item.businessUnitCode
        }));
		
	}
  /**
 * Returns a dynamic date string in the format:
 * Mon%20Sep%2029%202025%2018:14:35%20GMT+0530%20(India%20Standard%20Time)
 */
 export function getDynamicEncodedDateString(date = new Date()) {
  // Example: Mon Sep 29 2025 18:14:35 GMT+0530 (India Standard Time)
  const raw = date.toString();
  return encodeURIComponent(raw);
}

