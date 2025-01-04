import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"

import { compare } from "bcrypt"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authorize = async (credentials) => {
  try {
    const { username, password } = credentials;

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // If user not found
    if (!user) {
      throw new Error("User not found. Please sign up first.");
    }

    // If password is incorrect
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect password.");
    }

    // If email is not verified
    // if (!user.emailVerified) {
    //   throw new Error("Email not verified yet.");
    // }

    // Return user object to be used in NextAuth session
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error("Authorization error:", error.message);
    return null; // Return null to indicate failed login
  }
};

const handler = NextAuth(
  {
    // set custom session token expiration
    session: {
      strategy: "jwt",
      maxAge: 25 * 60
    },
      callbacks: {
    async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.email = user.email;
    }
    return token;
  },
  async session({ session, token, user }) {
    if (token) {
      session.user.id = token.id
    }
    return session;
  },
},
    providers: [
    CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
          return await authorize(credentials)
        }
      ,
    }),
      
    // EmailProvider({
    //   server: 'smtp.zoho.com',
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.NODEMAILER_ZOHO_MAIL_USER,
    //     pass: process.env.NODEMAILER_ZOHO_MAIL_PASS
    //   },
    //   from: process.env.NODEMAILER_ZOHO_MAIL_USER }),
    // ...add more providers here
  ],
}
)

export { handler as GET, handler as POST } 