import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { Connectiondb } from "@/lib/dbconnect";
import studentmodel from "@/model/studentlogin";
import profModel from "@/model/prof"; // 👈 Make sure you create this schema

export const authOptions: NextAuthOptions = {
  providers: [
    // 🎓 Student Login
    CredentialsProvider({
      id: "student-credentials",
      name: "Student Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await Connectiondb();
        try {
          const student = await studentmodel.findOne({ email: credentials.email });

          if (!student) {
            throw new Error("No student found with this email");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            student.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return {
            _id: student._id.toString(),
            email: student.email,
            name: student.studentname,
            role: "student",
            isVerified: student.isVerified,
          };
        } catch (err: any) {
          throw new Error(err.message || "Login failed");
        }
      },
    }),

    // 👨‍🏫 Prof Login
    CredentialsProvider({
      id: "prof-credentials",
      name: "Prof Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await Connectiondb();
        try {
          const prof = await profModel.findOne({ email: credentials.email });

          if (!prof) {
            throw new Error("No professor found with this email");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            prof.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return {
            _id: prof._id.toString(),
            email: prof.email,
            name: prof.profname,
            role: "prof",
            isVerified: prof.isVerified,
          };
        } catch (err: any) {
          throw new Error(err.message || "Login failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token._id = user._id;
        token.role = user.role; // 👈 Store role
        token.isVerified = user.isVerified;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }:any) {
      if (token) {
        session.user._id = token._id;
        session.user.role = token.role; // 👈 role added
        session.user.isVerified = token.isVerified;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
