import {
  Session as NextAuthSession,
  User as NextAuthUser,
  Profile as NextAuthProfile,
} from "next-auth";

// Define your custom User type
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  userLevel: number | null;
}

// Extend NextAuth types to use your custom User type
declare module "next-auth" {
  export interface Session extends NextAuthSession {
    user?: User;
  }

  export interface User extends NextAuthUser {
    userLevel?: number;
  }

  export interface Profile extends NextAuthProfile {
    userLevel?: number;
  }
}
