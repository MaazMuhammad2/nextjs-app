import { z } from "zod";

const messageSchema = z.object({
  content: z
    .string()
    .min(5, { message: "Content must be of 10 characters" })
    .max(300, { message: "Content must be no longer than 300 characters" }),
});
