import { getPhonePePaymentStatus } from "./apis/orderStatus.js";
import { initiatePhonePePayment } from "./apis/phonePay.js";

export default function apiHandler(app) {
    // Health check
    app.get("/health", (req, res) => res.json({ status: "ok" }));
    // PhonePe payment initiation
    app.post("/api/pay", initiatePhonePePayment);
    // PhonePe payment status
    app.get("/api/pay/status/:orderId", getPhonePePaymentStatus);
}