import { ERROR_CODES } from "./errorCodes.js";

export class CustomError extends Error {
  constructor(errorData, defaultErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR) {
    const errorCode = errorData.code || defaultErrorCode;
    super(errorCode); 
    this.code = errorCode;
    this.name = this.constructor.name; 
    this.data = errorData.data;
    this.message = errorData.message || this.message;
    this.isRetryable = errorData.isRetryable ?? true;
    Error.captureStackTrace(this, this.constructor); 
  }
}
