import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_FILE } from "./constants/App";

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const isAuthPage = pathname.startsWith("/auth");
    const isMatchOpenRoutes = [
        "/",
    ].find((route: string) => pathname === route) ?? undefined;
    
    const publicPages = ["/reset-password", "/forgot-password", "/verification"];
    const isPublicPage = publicPages.some(p => pathname.startsWith(p));
    
    if (isMatchOpenRoutes) {
        return NextResponse.next();
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    const isReservedPath = 
        pathname.startsWith("/_next") || 
        pathname.startsWith("/api") || 
        pathname.startsWith("/static") ||
        PUBLIC_FILE.test(pathname);

    if (!token && !isAuthPage && !isPublicPage && !isReservedPath) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};