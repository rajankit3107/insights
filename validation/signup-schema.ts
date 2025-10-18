import z from "zod";

export const usernameValidation = z
  .string()
  .min(4, "Username must be atleast 4 characters")
  .max(20, "Username should be less than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.email(),
  password: z.string(),
});
