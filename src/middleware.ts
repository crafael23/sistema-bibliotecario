import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { db } from "./server/db";

const isProtectedRoute = createRouteMatcher(["/(.*)"]);
const isWebhookRoute = createRouteMatcher(["/api/webhooks(.*)"]);
const isUploadthingRoute = createRouteMatcher(["/api/uploadthing(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Skip authentication for webhook routes
  //
  if (isUploadthingRoute(req)) {
    return;
  }
  if (isWebhookRoute(req)) {
    return;
  }

  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};