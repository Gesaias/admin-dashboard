import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    access_token: string;
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    accessToken: string;
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
      role: string;
    } & DefaultJWT;
  }
}
