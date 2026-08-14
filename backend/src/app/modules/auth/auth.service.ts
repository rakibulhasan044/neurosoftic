import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const AuthService = {
  register: async (payload: any) => {
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        name: payload.name,
      },
    });
    
    // Create customer profile
    await prisma.customerProfile.create({
      data: {
        userId: user.id,
      }
    });

    return user;
  },

  login: async (payload: any) => {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return { user, token };
  },


  changePassword: async (userId: string, payload: any) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    // Optional: verify old password if you want, but for forced change, they just logged in
    
    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        forcePasswordChange: false,
      },
    });

    return { message: "Password updated successfully" };
  }
};
