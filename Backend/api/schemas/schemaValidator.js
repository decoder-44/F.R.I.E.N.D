import { CustomError } from "../../errors/customError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";

export function validateRequestData(schema, data) {
  const { error } = schema.validate(data);

  if (error) {
    const errorObject = {
      code: ERROR_CODES[error.details[0].message],
    };
    throw new CustomError(errorObject);
  }
}
