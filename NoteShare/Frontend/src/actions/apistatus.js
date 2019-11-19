//import { BEGIN_API_CALL, API_CALL_ERROR } from "./actionTypes";

// API CALLS
export const BEGIN_API_CALL = "BEGIN_API_CALL";
export const API_CALL_ERROR = "API_CALL_ERROR";

export function beginApiCall() {
  return { type: BEGIN_API_CALL };
}

export function apiCallError() {
  return { type: API_CALL_ERROR };
}
