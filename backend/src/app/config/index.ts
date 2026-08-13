import dotenv from "dotenv";
import path from "path";
import { requireExpiry, requireInt, requireString } from "../utils/configHelper";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  env: process.env.NODE_ENV ?? "development",
  port: requireInt("PORT", 8000),
  saltRound: requireInt("BCRYPT_SALT_ROUND", 12),

  super_admin: {
    email: requireString("SUPER_ADMIN_EMAIL"),
    password: requireString("SUPER_ADMIN_PASSWORD"),
    name: requireString("SUPER_ADMIN_NAME"),
    contactNumber: requireString("SUPER_ADMIN_PHONE"),
  },

  jwt: {
    secret: requireString("JWT_SECRET"),
    expiresIn: requireExpiry("EXPIRES_IN", "20m"),
    refreshSecret: requireString("REFRESH_TOKEN_SECRET"),
    refreshExpiresIn: requireExpiry("REFRESH_TOKEN_EXPIRES_IN", "30d"),

  },
  stripe: {
    secret_key: requireString("SECRET_KEY"),
    publishable_key: requireString("PUBLISHABLE_KEY")
  },

  //   resetPassLink: requireString("RESET_PASS_LINK"),

  //   email: {
  //     user: requireString("SMTP_USER"),
  //     pass: requireString("SMTP_PASS"),
  //   },

    cloudinary: {
      cloudName: requireString("CLOUD_NAME"),
      apiKey: requireString("API_KEY"),
      apiSecret: requireString("API_SECRET"),
    },
} as const;

export default config;
