import { get } from "stack-trace";
import winston from "winston";
import { LOG_LEVEL } from "../constants.js";
import getRequiredHeaders from "./helperFunctions/getRequiredHeaders.js";

const getCallerInfo = () => {
  const trace = get();
  const caller = trace[2];
  return {
    functionName: caller.getFunctionName() || "anonymous",
    filePath: caller.getFileName(),
    lineNumber: caller.getLineNumber(),
  };
};

const logger = winston.createLogger({
  level: LOG_LEVEL.DEBUG,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

function getClientIP(req) {
  return req.clientIp;
}

function getUserAgent(req) {
  return req.headers["user-agent"];
}

function getOriginalURL(req) {
  return req.originalUrl;
}

function getPersonId(req) {
  return req.personId;
}

const getLoggableHeaders = (req) => {
  const availableHeaders = getRequiredHeaders(req);
  const headersForLogging = {};
  for (const header in availableHeaders) {
    if (req.headers[header] && availableHeaders[header].isLoggingEnabled) {
      headersForLogging[header] = req.headers[header];
    }
  }
  return headersForLogging;
};

export function log(level, message, parameters, req = null) {
  const callerInfo = getCallerInfo();
  const logData = { ...callerInfo, message, ...parameters };
  if (req) {
    const headersToLog = getLoggableHeaders(req);
    Object.assign(logData, headersToLog);
    logData["clientIp"] = getClientIP(req);
    logData["userAgent"] = getUserAgent(req);
    logData["url"] = getOriginalURL(req);
    logData["personId"] = getPersonId(req);
  }
  logger.log(level, logData);
}
