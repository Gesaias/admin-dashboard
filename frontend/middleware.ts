import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { PUBLIC_FILE } from "@/constants/App";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/public") ||
        pathname.startsWith("/api") ||
        pathname === "/favicon.ico" ||
        PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next();
    }

    // Pages that should be public (no redirect to login)
    const publicPages = [
        "/login",
        "/reset-password",
        "/forgot-password",
        "/verification",
        "/api/auth",
    ];
    for (const p of publicPages) {
        if (pathname === p || pathname.startsWith(`${p}/`)) {
            if (p === "/login" || p === "/") {
                try {
                    const token = await getToken({
                        req,
                        secret: process.env.NEXTAUTH_SECRET,
                    });
                    if (token) {
                        const url = req.nextUrl.clone();
                        url.pathname = "/dashboard";
                        return NextResponse.redirect(url);
                    }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                    // If token check fails, fall through and allow the public page
                }
            }
            return NextResponse.next();
        }
    }

    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });
        if (token) {
            return NextResponse.next();
        }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        // Token invalid or verification error - treat as not authenticated
    }

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|_next|static|favicon.ico).*)"],
};
