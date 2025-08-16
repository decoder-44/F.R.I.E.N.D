import { REQUEST_TYPE } from "../../constants.js";
import { requiredHeadersForGQL, requiredHeadersForRest } from "../../requiredHeaderConstants/constants.js";

const getRequiredHeaders = (req) => {
  return req.requestType === REQUEST_TYPE.REST
    ? requiredHeadersForRest
    : requiredHeadersForGQL;
};

export default getRequiredHeaders;
