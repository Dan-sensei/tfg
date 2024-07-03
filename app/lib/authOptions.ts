import { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "@/app/lib/enums";
import prisma from "@/app/lib/db";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials) return null;

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                        role: true,
                        collegeId: true,
                    },
                });

                if (user) {
                    return {
                        ...user,
                        id: user.id.toString(),
                        uid: user.id
                    };
                } else {
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile }) {
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.uid = user.uid
                token.role = user.role;
                token.collegeId = user.collegeId;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.role) {
                session.user.uid = token.uid;
                session.user.role = token.role;
                session.user.collegeId = token.collegeId;
            }
            return session;
        },
        redirect: async ({ baseUrl }) => {
            return baseUrl + "/dashboard";
        },
    },
};
