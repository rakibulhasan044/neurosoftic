import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import AppError from "../errors/AppError";
import config from "../config";
import { verifyToken } from "../utils/jwtHelper";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for token in headers or cookies
      let token = req.cookies?.accessToken;
      if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
      
      if (!token) {
        throw new AppError(
         403,
          "You are not authorized!",
        );
      }
      const verifiedUser = verifyToken(
        token,
        config.jwt.secret as Secret,
      );

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new AppError(401, "You are not authorized!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
