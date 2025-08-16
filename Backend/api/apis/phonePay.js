import crypto from "crypto";
import invokeAPI from "../../comerce/restRequestOperations/invokeApi.js";
import { HTTP_METHOD, LOG_LEVEL, PHONE_PE_API_PATHS, SERVICE_PROVIDER } from "../../constants.js";
import { log } from "../../utils/logger.js";

function buildInitiatePayload({ merchantId, amount, vpa, orderId, note, callbackUrl, userId }) {
    return {
        merchantId,
        merchantTransactionId: orderId,
        merchantUserId: userId || "anonymousUser",
        amount: amount,
        redirectUrl: callbackUrl,
        redirectMode: "APP",
        callbackUrl,
        paymentInstrument: {
            type: "UPI_INTENT",
            targetApp: "com.phonepe.app",
            vpa,
        },
        message: note || "",
    };
}

function buildChecksum({ base64Payload, apiPath, saltKey, saltIndex }) {
    const stringToSign = base64Payload + apiPath + saltKey;
    return crypto.createHash("sha256").update(stringToSign).digest("hex") + "###" + saltIndex;
}

async function callPhonePePayAPI({ apiPath, base64Payload, checksum, merchantId, req }) {
   try {
    const path = process.env.PHONE_PE_BASE_URL+apiPath;
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
   }catch(error) {
    log(
        LOG_LEVEL.ERROR,
        `Error while processing payment with phone pay due to ${error.message}`,
        { base64Payload },
        req
    );
    throw error({
        code: "PHONE_PE_PAYMENT_FIELD_ERROR"
    })
   }
}

export async function initiatePhonePePayment(req, res) {
    try {
        const { amount, vpa, orderId, note } = req.body;
        if (!amount || !vpa || !orderId) return res.status(400).json({ message: "Missing required fields" });

        const merchantId = process.env.PHONE_PE_MERCHANT_ID;
        const saltKey = process.env.PHONE_PE_SALT_KEY;
        const saltIndex = process.env.PHONE_PE_SALT_INDEX;
        const callbackUrl = process.env.PHONE_PE_CALLBACK_URL;

        const payload = buildInitiatePayload({ merchantId, amount, vpa, orderId, note, callbackUrl, userId: req.userId });
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
        const apiPath = PHONE_PE_API_PATHS.PAY;
        const checksum = buildChecksum({ base64Payload, apiPath, saltKey, saltIndex });

        const response = await callPhonePePayAPI({ apiPath, base64Payload, checksum, merchantId, req });

        if (response?.success && response?.data?.instrumentResponse?.intentUrl) {
            return res.json({ redirectUrl: response.data.instrumentResponse.intentUrl });
        }
        log(LOG_LEVEL.ERROR, "PhonePe response missing intentUrl", { response }, req);
        return res.status(500).json({ message: "Failed to initiate payment" });
    } catch (error) {
        log(LOG_LEVEL.ERROR, "PhonePe payment initiation failed", { error: error.message }, req);
        return res.status(500).json({ message: "PhonePe initiation failed" });
    }
}
