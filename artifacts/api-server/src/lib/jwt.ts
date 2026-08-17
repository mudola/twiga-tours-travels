import { SignJWT, jwtVerify } from "jose";

export interface AdminJwtPayload {
  sub: string;   // admin user id
  email: string;
  role: string;
  name: string;
}

function getSecret() {
  const raw = process.env["SESSION_SECRET"] ?? process.env["JWT_SECRET"];
  if (!raw) throw new Error("SESSION_SECRET or JWT_SECRET env var is required");
  return new TextEncoder().encode(raw);
}

export async function signAdminToken(payload: AdminJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<AdminJwtPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as AdminJwtPayload;
}
