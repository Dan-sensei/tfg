import { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "@/app/lib/enums";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const userdb = [
                    { id: "1", name: "Mario", username: "mario", password: "mario", role: Role.STUDENT, email: "jsmith@example.com" },
                    { id: "1", name: "Monika", username: "monika", password: "monika", role: Role.STUDENT, email: "jsmith@example.com" },
                    { id: "1", name: "Veronica", username: "veronica", password: "veronica", role: Role.STUDENT, email: "jsmith@example.com" },
                    { id: "1", name: "Oscar", username: "oscar", password: "oscar", role: Role.STUDENT, email: "jsmith@example.com" },
                    { id: "1", name: "Vlad", username: "vlad", password: "vlad", role: Role.STUDENT, email: "jsmith@example.com" },
                    { id: "2", name: "Tutor 1", username: "tutor1", password: "tutor1", role: Role.TUTOR, email: "jsmith@example.com" },
                    { id: "2", name: "Tutor 2", username: "tutor2", password: "tutor2", role: Role.TUTOR, email: "jsmith@example.com" },
                    { id: "3", name: "Manager", username: "manager", password: "manager", role: Role.MANAGER, email: "jsmith@example.com" },
                    { id: "4", name: "Admin", username: "admin", password: "admin", role: Role.ADMIN, email: "jsmith@example.com" },
                ];

                const college = {
                    id: 1,
                    name: "Universidad de Alicante",
                };

                const user = userdb.find((u) => u.username === credentials?.username && u.password === credentials.password);

                if (user) {
                    return {
                        ...user,
                        college: {
                            id: college.id,
                            name: college.name,
                        },
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
                token.role = user.role;
                token.college = user.college
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.role) {
                session.user.role = token.role;
                session.user.college = token.college
            }
            return session;
        },
        redirect: async ({ baseUrl }) => {
            return baseUrl + "/dashboard";
        },
    },
};
