import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { UserRole } from "../../enums/user-role";

declare module "next-auth" {
  interface User {
    id: string;
    username?: string;
    role?: UserRole;
    suspended: boolean;
  }

  interface Session {
    access_token?: string;
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    access_token?: string;
    accessToken?: string;
    user?: {
      id: string;
      email?: string | null;
      name?: string | null;
      username?: string;
      role?: UserRole;
      suspended: boolean;
    } & DefaultJWT;
  }
}

// Evita que o arquivo seja tratado como um script global em alguns setups TS
export {};
