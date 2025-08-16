import { HTTP_METHOD, LOG_LEVEL } from "../../constants.js";
import { log } from "../../utils/logger.js";
import { getAxiosInstance } from "./getAxiosInstance.js";
import { HTTP_STATUS_CODE } from "../../constants.js";
import { removeServiceToken } from "../../utils/removeToken.js";
import getApiRequestTimeout from "../../utils/getApiRequestTimeOut.js";

function handleInvokeAPIError(error, data, req) {
  let errorsData = error.response?.data;
  if (errorsData && typeof errorsData === "string") {
    error.response.data = {
      message: error.message,
    };
  }

  if (error.response?.status === HTTP_STATUS_CODE.AUTHORIZATION_FAILURE) {
    removeServiceToken(data.serviceName);
  }

  const headers = data.headers;
  delete headers["Authorization"];
  delete headers["user_token"];
  log(
    LOG_LEVEL.ERROR,
    `API_FAILED: ${error.message}`,
    {
      errorsData: errorsData,
      apiUrl: data["url"],
      functionName: "invokeAPI",
      headers,
      serviceName: data.serviceName,
    },
    req
  );
  throw error;
}

export default async function invokeAPI(data, req = null) {
  const options = {
    method: data.method,
    url: data.url,
    ...(data.method === HTTP_METHOD.GET
      ? {
          params: data.data,
        }
      : { data: data.data }),
    headers: data.headers,
    timeout: getApiRequestTimeout(data.serviceName),
  };
  const instance = await getAxiosInstance(data.serviceName, req);
  const startTime = new Date();
  return instance
    .request(options)
    .then((response) => {
      const apiResponseTime = new Date() - startTime;
      const headers = data.headers;
      delete headers["Authorization"];
      delete headers["user_token"];
      log(
        LOG_LEVEL.INFO,
        `API_SUCCESS`,
        {
          apiUrl: data["url"],
          functionName: "invokeAPI",
          headers,
          apiResponseTime,
          serviceName: data.serviceName,
        },
        req
      );
      return response.data;
    })
    .catch((error) => {
      // TODO: Masking of the error in production
      handleInvokeAPIError(error, data, req);
    });
}
