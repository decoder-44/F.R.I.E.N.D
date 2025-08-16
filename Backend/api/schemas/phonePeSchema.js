import Joi from "joi";
import { ERROR_CODES } from "../../errors/errorCodes.js";

export const phonePeSchema = Joi.object({
    amount: Joi.number().required().messages({
        "any.required": ERROR_CODES.AMOUNT_FIELD_IS_REQUIRED,
        "number.base": ERROR_CODES.ENTER_VALID_AMOUNT,
        "string.empty": ERROR_CODES.AMOUNT_FIELD_IS_REQUIRED,
    }),
    recUpiId: Joi.string().required().messages({
        "any.required": ERROR_CODES.RECEIVER_UPI_ID_FIELD_IS_MISSING,
        "string.base": ERROR_CODES.ENTER_VALID_RECEIVER_UPI_ID,
        "string.empty": ERROR_CODES.RECEIVER_UPI_ID_FIELD_IS_MISSING,
    }),
    note: Joi.string().allow("").messages({
        "string.base": ERROR_CODES.ENTER_VALID_NOTE,
    }),
}).required()
    .unknown(false)
    .messages({
        "object.unknown": ERROR_CODES.REQUEST_BODY_HAS_EXTRA_FIELDS,
        "any.required": ERROR_CODES.REQUEST_BODY_IS_REQUIRED,
    });