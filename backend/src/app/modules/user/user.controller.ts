import { Request, Response } from "express";
import { UserService } from "./user.service";
import { UserValidation } from "./user.validation";

export const UserController = {
  getProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const profile = await UserService.getProfile(userId);
      res.status(200).json({ success: true, data: profile });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const validatedData = UserValidation.updateProfileSchema.parse(req.body);
      const updatedProfile = await UserService.updateProfile(userId, validatedData);
      res.status(200).json({ success: true, data: updatedProfile });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getAddresses: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const addresses = await UserService.getAddresses(userId);
      res.status(200).json({ success: true, data: addresses });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  addAddress: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const validatedData = UserValidation.addAddressSchema.parse(req.body);
      const address = await UserService.addAddress(userId, validatedData);
      res.status(201).json({ success: true, data: address });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateAddress: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;
      const validatedData = UserValidation.updateAddressSchema.parse(req.body);
      const address = await UserService.updateAddress(userId, id, validatedData);
      res.status(200).json({ success: true, data: address });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteAddress: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;
      await UserService.deleteAddress(userId, id);
      res.status(200).json({ success: true, message: "Address deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Admin Endpoints
  createUser: async (req: Request, res: Response) => {
    try {
      const adminRole = (req as any).user.role;
      // Optionally validate payload with Zod here
      const user = await UserService.createUser(req.body, adminRole);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const adminRole = (req as any).user.role;
      const { id } = req.params;
      await UserService.deleteUser(id, adminRole);
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateUserRole: async (req: Request, res: Response) => {
    try {
      const adminRole = (req as any).user.role;
      const { id } = req.params;
      const { role } = req.body;
      const user = await UserService.updateUserRole(id, role, adminRole);
      res.status(200).json({ success: true, message: "Role updated successfully", data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  createAdmin: async (req: Request, res: Response) => {
    try {
      const result = await UserService.createAdmin(req.body);
      res.status(201).json({
        success: true,
        message: "Admin created successfully",
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getCustomers: async (req: Request, res: Response) => {
    try {
      const result = await UserService.getCustomers(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};
