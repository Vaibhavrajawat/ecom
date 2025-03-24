import jwt from "jsonwebtoken";

interface SignOptions {
  expiresIn?: string | number;
}

export function signJwtAccessToken(payload: any, options: SignOptions = {}) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = jwt.sign(payload, secret!, {
    ...(options && options),
  });

  return token;
}

export function verifyJwtToken(token: string) {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    const decoded = jwt.verify(token, secret!);
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
