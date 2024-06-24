import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

interface College {
    id: number;
}

interface UserRole {
    role: number;
    college: College;
}

declare module "next-auth" {
    interface Session {
        user: UserRole & DefaultSession["user"];
    }

    interface User extends DefaultUser, UserRole {}
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT, UserRole {}
}
