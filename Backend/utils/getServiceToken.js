import RedisClient from "./redis.js";
import {
    HTTP_METHOD,
    SERVICE_IDENTITY_CONFIG_MAPPING,
    SERVICE_IDENTITY_REQUEST_ATTRIBUTES,
    LOG_LEVEL,
} from "../constants.js";
import invokeAPI from "../commerce/restRequestOperations/invokeApi.js";
import { log } from "../utils/logger.js";

export default async function getServiceToken(serviceName, req) {
    const redisClient = new RedisClient();
    const identityConfigMapping = SERVICE_IDENTITY_CONFIG_MAPPING[serviceName];
    const identityConfigReqAttribute =
        SERVICE_IDENTITY_REQUEST_ATTRIBUTES[serviceName];
    const tokenName = identityConfigMapping.AUTH_TOKEN_NAME;
    const authToken = await redisClient.getKeyData(tokenName);
    if (authToken) {
        return authToken;
    }
    try {
        const data = {};
        for (let key in identityConfigReqAttribute) {
            data[key] = process.env[serviceName + identityConfigReqAttribute[key]];
        }
        var headers = { "Content-Type": "application/x-www-form-urlencoded" };
        const options = {
            method: HTTP_METHOD.POST,
            url: process.env[`${serviceName}_IDENTITY_TOKEN_URL`],
            data: data,
            headers: headers,
        };
        const tokenResponse = await invokeAPI(options);
        const accessToken = tokenResponse.access_token;
        const accessTokenTtl = tokenResponse.expires_in - 100;
        redisClient.setKey(tokenName, accessToken, accessTokenTtl);
        return accessToken;
    } catch (error) {
        log(
            LOG_LEVEL.ERROR,
            `Error while generating the token due to ${error.message}`,
            {},
            req
        );
        throw new Error(`${serviceName} token could not be generated`);
    }
}
