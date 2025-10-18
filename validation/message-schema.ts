import z from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(20, { error: "message must contain atleast 20 characters" })
    .max(300, { error: "message should not contain more than 300 characters" }),
});
