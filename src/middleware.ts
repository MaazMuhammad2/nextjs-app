import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// This function runs before every request
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // ✅ Redirect signed-in users away from auth pages
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ✅ Redirect non-authenticated users away from protected routes
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // ✅ If no conditions match, allow request to continue
  return NextResponse.next();
}

// ✅ Run middleware only on these routes
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:p*", "/verify/:path*"],
};
