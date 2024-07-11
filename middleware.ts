import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


// This is a middleware function that checks if the user is authenticated.
export default withAuth(
    function middleware(request: NextRequestWithAuth) {

        if (!request.nextauth.token) {
            return NextResponse.redirect(new URL("/auth/signin", request.url));
        }

    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        }
    }
);
export const config = { matcher: ["/dashboard/:path*", "/api/dashboard/:path*"] };
