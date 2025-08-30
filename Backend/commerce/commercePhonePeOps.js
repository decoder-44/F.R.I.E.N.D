import { HTTP_METHOD, LOG_LEVEL, PHONE_PE_API_PATHS, SERVICE_PROVIDER } from "../constants.js";
import crypto from "crypto";
import invokeAPI from "./restRequestOperations/invokeApi.js";
import { ERROR_CODES } from "../errors/errorCodes.js";
import { CustomError } from "../errors/customError.js";
import { log } from "../utils/logger.js";

class CommercePhonePeOps {
    constructor(req) {
        this.req = req;
        this.baseUrl = process.env.PHONE_PE_BASE_URL;
    }

    buildInitiatePayload({ merchantId, amount, recUpiId, orderId, note, userId }) {
        return {
            merchantId,
            merchantTransactionId: orderId,
            merchantUserId: process.env.PHONE_PE_MERCHANT_ID,
            amount: amount,
            // redirectUrl: callbackUrl,
            redirectMode: "APP",
            // callbackUrl,
            paymentInstrument: {
                type: "UPI_INTENT",
                targetApp: "com.phonepe.app",
                recUpiId,
            },
            message: note || "",
        };
    }

    buildChecksum({ base64Payload, saltKey, saltIndex }) {
        const stringToSign = base64Payload + PHONE_PE_API_PATHS.PAY + saltKey;
        return crypto.createHash("sha256").update(stringToSign).digest("hex") + "###" + saltIndex;
    }

    async callPhonePePayAPI({ base64Payload, checksum, merchantId, req }) {
        log(
            LOG_LEVEL.INFO,
            "CallPhonePePayAPI method started",
            { base64Payload },
            req
        );
        try {
            const path = `${this.baseUrl}` + PHONE_PE_API_PATHS.PAY;
            const options = {
                method: HTTP_METHOD.POST,
                url: path,
                data: { request: base64Payload },
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": checksum,
                    "X-MERCHANT-ID": merchantId,
                },
                serviceName: SERVICE_PROVIDER.PHONE_PE,
            };
            const response = await invokeAPI(options, req);
            log(
                LOG_LEVEL.INFO,
                "Payment successful through phone pay",
                { base64Payload },
                req
            );
            return response;
        } catch (error) {
            log(
                LOG_LEVEL.ERROR,
                `Error while processing payment with phone pay due to ${error.message}`,
                { base64Payload },
                req
            );
            const errorData = {
                code: ERROR_CODES.PHONE_PE_CALL_FAILED,
                data: base64Payload,
            }
            throw new CustomError(errorData);
        }
    }
}

export default CommercePhonePeOps;