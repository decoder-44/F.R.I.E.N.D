export async function getPhonePePaymentStatus(req, res) {
    try {
        const { orderId } = req.params;
        if (!orderId) return res.status(400).json({ message: "Missing orderId" });
        const merchantId = process.env.PHONE_PE_MERCHANT_ID;
        const saltKey = process.env.PHONE_PE_SALT_KEY;
        const saltIndex = process.env.PHONE_PE_SALT_INDEX;
        const apiPath = `${PHONE_PE_API_PATHS.STATUS_BASE}/${merchantId}/${orderId}`; 
        const stringToSign = apiPath + saltKey;
        const checksum = crypto.createHash("sha256").update(stringToSign).digest("hex") + "###" + saltIndex;
        const option = {
                method: HTTP_METHOD.GET,
                url: apiPath,
                data: {},
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": checksum,
                    "X-MERCHANT-ID": merchantId,
                },
                serviceName: SERVICE_PROVIDER.PHONE_PE,
            };
        const response = await invokeAPI(option,req);
        return res.json(response);
    } catch (error) {
        log(LOG_LEVEL.ERROR, "PhonePe status fetch failed", { error: error.message }, req);
        return res.status(500).json({ message: "Status fetch failed" });
    }
}