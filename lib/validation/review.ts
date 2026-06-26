import { z } from "zod";

const CONTROL_CHARS = /[\x00-\x1f\x7f]/g;
const sanitized = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v.replace(CONTROL_CHARS, ""));

export const reviewSchema = z.object({
  authorName: sanitized(80).pipe(z.string().min(2, "Please enter your name.")),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must be at most 5."),
  content: sanitized(1000).pipe(
    z.string().min(10, "Please write at least 10 characters."),
  ),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
