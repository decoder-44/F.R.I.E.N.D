export const LOG_LEVEL = {
    INFO: "info",
    ERROR: "error",
    WARN: "warn",
    DEBUG: "debug",
}

export const REQUEST_TYPE = {
    GQL: "GQL",
    REST: "REST",
};

export const HTTP_METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
}

export const HTTP_STATUS_CODE = {
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 503,
    NOT_FOUND: 404,
    AUTHORIZATION_FAILURE: 401,
    PERMISSION_DENIED: 403,
    OK: 200,
    CREATED: 201,
    REDIRECT: 301,
};

export const SERVICE_PROVIDER = {
    PHONE_PE: "PHONE_PE",
}

export const SERVICE_IDENTITY_CONFIG_MAPPING = {
    [SERVICE_PROVIDER.PHONE_PE]: {
        AUTH_TOKEN_NAME: "ORCHESTRATOR_PHONE_PE_AUTH_TOKEN"
    }
}

export const SERVICE_IDENTITY_REQUEST_ATTRIBUTES = {
    
};

export const ENV_SUFFIX = {
    API_TIMEOUT_SUFFIX: "_SERVICE_API_TIMEOUT",
};

export const SERVICE_AXIOS_INSTANCE_CONFIG_MAP = {
    [SERVICE_PROVIDER.PHONE_PE]: {
        API_ACCESS_TOKEN: false,
    },
};

export const PHONE_PE_API_PATHS = {
    PAY: "/pg/v1/pay",
    STATUS_BASE: "/pg/v1/status", 
};

export const REDIS_CONNECTION_STATE = {
    ERROR: "error",
    CONNECT: "connect",
};

export const URL_TYPES = {
    COMMERCE: "COMMERCE",
}