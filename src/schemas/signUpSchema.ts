import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username name must be less than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain any special characters");

export const signupSchema = z.object({
  usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});
