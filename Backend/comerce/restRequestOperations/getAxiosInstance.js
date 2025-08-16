import axios from "axios";
import { SERVICE_AXIOS_INSTANCE_CONFIG_MAP } from "../../constants.js";
import getServiceToken from "../../utils/getServiceToken.js";

export async function getAxiosInstance(serviceName, req) {
    const instanceConfig = SERVICE_AXIOS_INSTANCE_CONFIG_MAP[serviceName] || {};
    let headers = {};
    if (instanceConfig.API_ACCESS_TOKEN) {
        const serviceToken = await getServiceToken(serviceName, req);
        headers = {
            Authorization: `Bearer ${serviceToken}`,
        };
    }
    // Allow base URL via env e.g. PHONE_PE_BASE_URL
    const baseURL = process.env[`${serviceName}_BASE_URL`];
    return axios.create({
        ...(baseURL ? { baseURL } : {}),
        ...(Object.keys(headers).length ? { headers } : {}),
    });
}