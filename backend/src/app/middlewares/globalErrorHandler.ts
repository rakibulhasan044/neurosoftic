import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { handleJwtError } from "../errors/handleJwtError";
import logger from "../lib/logger";
import handlePrismaError from "../errors/handlePrismaError";
import handleZodError from "../errors/handleZodError";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isOperational = error instanceof AppError && error.statusCode < 500;

  if (!isOperational) {
    logger.error({
      message: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
      body: {
        ...req.body,
        password: req.body?.password ? "[REDACTED]" : undefined,
        token: req.body?.token ? "[REDACTED]" : undefined,
        refreshToken: req.body?.refreshToken ? "[REDACTED]" : undefined,
      },
    });
  } else {
    logger.warn({ message: error.message, path: req.path, method: req.method });
  }

  let statusCode = 500;
  let message = "Something Went Wrong!";
  let errorDetails = [
    {
      message: "Something went wrong.",
    },
  ];

  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    const simplifiedError = handlePrismaError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails;
  } else if (error instanceof jwt.JsonWebTokenError) {
    const simplifiedError = handleJwtError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorDetails = [
      {
        message: error.message,
      },
    ];
  } else if (error instanceof Error) {
    message = error.message;
    errorDetails = [
      {
        message: error.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    stack:
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.stack
        : [],
  });
};

export default globalErrorHandler;
