import { prisma } from "../lib/prisma";
import config from "../config";
import bcrypt from "bcrypt";

export const seedSuperAdmin = async () => {
  try {
    // Check if any SUPER_ADMIN exists
    const superAdminExists = await prisma.user.findFirst({
      where: {
        role: "SUPER_ADMIN",
      },
    });

    if (!superAdminExists) {
      console.log("No SUPER_ADMIN found. Seeding Super Admin from environment variables...");
      const hashedPassword = await bcrypt.hash(config.super_admin.password, config.saltRound);

      await prisma.user.create({
        data: {
          email: config.super_admin.email,
          password: hashedPassword,
          name: config.super_admin.name,
          phone: config.super_admin.contactNumber,
          role: "SUPER_ADMIN",
          forcePasswordChange: false, // Super admin seeded from env shouldn't be forced
        },
      });
      console.log("SUPER_ADMIN seeded successfully.");
    } else {
      console.log("SUPER_ADMIN already exists. Skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding SUPER_ADMIN:", error);
  }
};
