import { ERROR_CODES } from "./errorCodes.js";
import { HTTP_STATUS_CODE } from "../constants.js";
import { ERROR_MESSAGES } from "./errorMessages.js";

export function getErrorData(error, req) {
  let errorCode = error.code || ERROR_CODES.INTERNAL_SERVER_ERROR;
  let isRetryable = error.isRetryable;
  const errorMessage = ERROR_MESSAGES[error.code] ?? error.code;
  const errorData = error.data || {};
  const statusCode =
    HTTP_STATUS_CODE[errorCode] || HTTP_STATUS_CODE.BAD_REQUEST;
  return {
    error: {
      code: errorCode,
      message: errorMessage,
      data: errorData,
      statusCode: statusCode,
      isRetryable,
    },
  };
}
