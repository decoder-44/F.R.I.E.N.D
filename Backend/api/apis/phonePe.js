import { LOG_LEVEL } from "../../constants.js";
import { log } from "../../utils/logger.js";
import { getErrorData } from "../../errors/getErrorData.js";
import { validateRequestData } from "../schemas/schemaValidator.js";
import { phonePeSchema } from "../schemas/phonePeSchema.js";
import CommercePhonePeOps from "../../commerce/commercePhonePeOps.js";
import { PaymentsOps } from "../../commerce/payments/paymentsOps.js";

export async function initiatePhonePePayment(req, res) {
    const { amount, recUpiId, note } = req.body;
    const merchantId = process.env.PHONE_PE_MERCHANT_ID;
    const saltKey = process.env.PHONE_PE_SALT_KEY;
    const saltIndex = process.env.PHONE_PE_SALT_INDEX;
    // const callbackUrl = process.env.PHONE_PE_CALLBACK_URL;
    try {
        validateRequestData(phonePeSchema, req.body);
        const paymentOps = new PaymentsOps(req);
        const orderId = await paymentOps.getPhonePeOrderId(recUpiId);
        const commercePhonePeOps = new CommercePhonePeOps(req);
        const payload = commercePhonePeOps.buildInitiatePayload({ merchantId, amount, recUpiId, orderId, note, userId: req.userId });
        const base64Payload =btoa(JSON.stringify(payload));
        const checksum = commercePhonePeOps.buildChecksum({ base64Payload, saltKey, saltIndex });
        const response = await commercePhonePeOps.callPhonePePayAPI({ base64Payload, checksum, merchantId, req });
        if (response?.success && response?.data?.instrumentResponse?.intentUrl) {
            return res.json({ redirectUrl: response.data.instrumentResponse.intentUrl });
        }
    } catch (error) {
        log(LOG_LEVEL.ERROR, "PhonePe payment initiation failed", { error: error.message }, req);
        const errorData = getErrorData(error, req);
        return res.status(400).json(errorData);
    }
}
