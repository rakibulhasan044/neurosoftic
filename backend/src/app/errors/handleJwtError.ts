import jwt from "jsonwebtoken";
import { TGenericErrorResponse } from "../interfaces/error.interface";
import config from "../config";

const { JsonWebTokenError, TokenExpiredError, NotBeforeError } = jwt;

export const handleJwtError = (
  error: InstanceType<typeof jwt.JsonWebTokenError>,
): TGenericErrorResponse => {
  const isDevelopment = config.env === "development";
  let message = "Authentication failed.";

  if (error instanceof TokenExpiredError) {
    message = "Access token has expired.";
  } else if (error instanceof NotBeforeError) {
    message = isDevelopment
      ? `Token not active until ${error.date}`
      : "Authentication failed.";
  } else if (error instanceof JsonWebTokenError) {
    message = isDevelopment
      ? `JWT error: ${error.message}`
      : "Authentication failed.";
  }

  return {
    statusCode: 401,
    message,
    errorDetails: [{ message }],
  };
};
