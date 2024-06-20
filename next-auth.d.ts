import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";


declare module "next-auth" {
    interface Session {
        user: {
            role: int
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        role: int
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role: int
    }
}