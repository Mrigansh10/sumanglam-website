import { createHash, timingSafeEqual } from "crypto";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/api/rate-limit";
import { getServerEnv } from "@/lib/env";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Compare via fixed-length digests so mismatched lengths and early exits
// don't leak timing information about the stored credential.
function safeEqual(a: string, b: string): boolean {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24h — single-admin panel, keep sessions short
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        if (!rateLimit(clientKey(request, "login"), { limit: 5, windowMs: 15 * 60_000 })) {
          return null;
        }

        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const env = getServerEnv();
        if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) return null;

        const emailMatches = safeEqual(
          parsed.data.email.toLowerCase(),
          env.ADMIN_EMAIL.toLowerCase(),
        );
        const passwordMatches = safeEqual(parsed.data.password, env.ADMIN_PASSWORD);
        if (!emailMatches || !passwordMatches) return null;

        return {
          id: "sumanglam-admin",
          name: "Sumanglam Admin",
          email: env.ADMIN_EMAIL,
        };
      },
    }),
  ],
});
