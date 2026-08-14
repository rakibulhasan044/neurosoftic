import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

export const AuthController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  },


  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const result = await AuthService.changePassword(userId, req.body);
      res.status(200).json({
        success: true,
        message: "Password changed successfully",
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  }
};
