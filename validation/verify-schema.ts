import z from "zod";

export const verifySchema = z.object({
  code: z.string().length(6, { error: "verificaion code must be 6 digits" }),
});
