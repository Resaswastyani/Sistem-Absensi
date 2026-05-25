// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import bcryptjs from "bcryptjs";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret",
);

export async function hashPassword(password: string) {
  return bcryptjs.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcryptjs.compare(password, hash);
}

export async function createToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 60 });
    return payload as { id: number; email: string; role: string; name: string };
  } catch {
    return null;
  }
}
