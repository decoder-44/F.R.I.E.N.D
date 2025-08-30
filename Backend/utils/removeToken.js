import { SERVICE_IDENTITY_CONFIG_MAPPING } from "../constants.js";
import RedisClient from "./redis.js";

export async function removeServiceToken(serviceName) {
    const serviceConfig = SERVICE_IDENTITY_CONFIG_MAPPING[serviceName];
    if (serviceConfig) {
        const tokenKey = serviceConfig.AUTH_TOKEN_NAME;
        const redisClient = new RedisClient();
        await redisClient.deleteKey(tokenKey);
    }
}
