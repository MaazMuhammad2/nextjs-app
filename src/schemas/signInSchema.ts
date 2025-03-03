import { z } from "zod";

const signinSchema = z.object({
  identifier: z.string(), // email hi ka doosra name h
  password: z.string(),
});
