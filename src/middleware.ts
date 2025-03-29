import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ["http://localhost:3000"]; // Add other allowed origins here

export function middleware(req: NextRequest) {
  // Get the 'Origin' header from the request
  const origin = req.headers.get("Origin");

  // If the Origin header is missing, it's a same-origin request
  if (!origin) {
    // No need to apply CORS headers for same-origin requests
    return NextResponse.next();
  }

  // Normalize the origin to handle cases like trailing slashes
  const normalizedOrigin = origin.replace(/\/$/, "");

  // Check if the origin is in the allowed list
  if (allowedOrigins.includes(normalizedOrigin)) {
    const response = NextResponse.next();

    // Set CORS headers for allowed origins
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 200 });
    }

    return response;
  }

  // If the origin is not allowed, return a forbidden response
  return new NextResponse("Forbidden", { status: 403 });
}

export const config = {
  matcher: ["/api/:path*"], // Apply this middleware to API routes
};
