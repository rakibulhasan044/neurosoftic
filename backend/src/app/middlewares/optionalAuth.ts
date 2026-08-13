import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import config from "../config";
import { verifyToken } from "../utils/jwtHelper";

const optionalAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.cookies?.accessToken;
      if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
      
      if (token) {
        const verifiedUser = verifyToken(
          token,
          config.jwt.secret as Secret,
        );
        (req as any).user = verifiedUser;
      }
      
      next();
    } catch (error) {
      // If token is invalid, just proceed as guest
      next();
    }
  };
};

export default optionalAuth;
