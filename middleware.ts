import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(request: NextRequestWithAuth) {
        if (!request.nextauth.token) {
            console.log("wah")
            return NextResponse.redirect(new URL("/auth/signin", request.url));
        }

        if (request.nextauth.token?.role !== "admin") {
            return NextResponse.rewrite(new URL("/denied", request.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/signin"
        }
    }
);
export const config = { matcher: ["/dashboard/:path*"] };
