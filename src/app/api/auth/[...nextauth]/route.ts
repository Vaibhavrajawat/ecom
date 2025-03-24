import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { baseAuthOptions, getGoogleCredentials } from "@/lib/auth";

async function getAuthOptions(): Promise<AuthOptions> {
  // Get the Google credentials from database or env vars
  const googleCredentials = await getGoogleCredentials();

  // Clone the base auth options to avoid modifying the original
  const authOptions: AuthOptions = {
    ...baseAuthOptions,
    providers: [
      GoogleProvider({
        clientId: googleCredentials.clientId,
        clientSecret: googleCredentials.clientSecret,
      }),
      ...baseAuthOptions.providers,
    ],
  };

  return authOptions;
}

async function handler(req: Request, res: Response) {
  const authOptions = await getAuthOptions();
  return await NextAuth(authOptions)(req, res);
}

export { handler as GET, handler as POST };
