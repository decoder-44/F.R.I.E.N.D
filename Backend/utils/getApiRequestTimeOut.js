import { ENV_SUFFIX } from "../constants.js";

const getApiRequestTimeout = (serviceName) => {
    const defaultTimeout = process.env.DEFAULT_REQUEST_TIMEOUT;
    return (
        process.env[serviceName + ENV_SUFFIX.API_TIMEOUT_SUFFIX] ?? defaultTimeout
    );
};

export default getApiRequestTimeout;
