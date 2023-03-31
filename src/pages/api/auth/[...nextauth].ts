import NextAuth, {DefaultSession} from "next-auth"
import { JWT } from "next-auth/jwt";
import CredentialsProvider from 'next-auth/providers/credentials';
import crypto from 'crypto';
import fs from 'fs';
import FileOps from "@/pages/api/utils/FileOps"
var path1 = require("path");
import {User} from "@/utils/User"

export interface Session extends DefaultSession {
  user?: User
}
export const readUsers = async ():Promise<User[]> => {
  const path = "users/users.json";
  const fileContent = await FileOps.ReadFile(path);
  if(fileContent != null){
    const data = JSON.parse((fileContent as Buffer).toString('utf-8')) as User[];
    return data;
  }
  else return [];
  
};
export const writerUser = async (users: User[]) => {
  const path = "users/users.json";
  await FileOps.SaveFile(path, Buffer.from(JSON.stringify(users, null, "\t"), 'utf8'));
  return;
};
// import EmailProvider from "next-auth/providers/email"
// import AppleProvider from "next-auth/providers/apple"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials:{
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) : Promise<any>
      {
        
        const users = await readUsers();
        console.log(users);
        if(credentials!=undefined && credentials != null){
          if(credentials.username == undefined || credentials.username == null) return null;
          if(credentials.password == undefined || credentials.password == null) return null;
          const user = users.filter(x=>x.email == credentials.username && x.password == credentials.password);
          if(user.length == 0) return null;
          return user[0];
        }
        return null;
      }
    })
  ],
  // Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
  // https://next-auth.js.org/configuration/databases
  //
  // Notes:
  // * You must install an appropriate node_module for your database
  // * The Email provider requires a database (OAuth providers do not)
  // database: process.env.DATABASE_URL,

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `strategy: 'jwt'` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.SECRET,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: '/Auth',  // Displays signin buttons
    signOut: '/', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
    async session({ session, token, user }) { 
      session.user.userLevel = (token.user as User).userLevel;
   return session;
      
    },
    async jwt({ token, user, account, profile, isNewUser } ): Promise<JWT> {
      if (user) {
        token.user = user
      }
      return token
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // Enable debug messages in the console if you are having problems
  debug: true,
})
