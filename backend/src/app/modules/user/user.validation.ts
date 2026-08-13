import { z } from "zod";

export const UserValidation = {
  updateProfileSchema: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
  }),

  addAddressSchema: z.object({
    street: z.string({ required_error: "Street is required" }),
    city: z.string({ required_error: "City is required" }),
    state: z.string({ required_error: "State is required" }),
    postalCode: z.string({ required_error: "Postal Code is required" }),
    country: z.string({ required_error: "Country is required" }),
    isDefault: z.boolean().optional().default(false),
  }),

  updateAddressSchema: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
};
