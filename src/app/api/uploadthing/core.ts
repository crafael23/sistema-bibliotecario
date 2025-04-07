import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Define middleware to handle auth and permissions
const middleware = async () => {
  // For demo purposes, we're not implementing complex auth
  // In a real app, you would check user auth here
  const user = { id: "library-admin" };

  console.log("uploadthing middleware hit");

  // In a real app, check if user exists
  // if (!user) throw new UploadThingError("Unauthorized");

  // Always authorized for this demo
  return { userId: user.id };
};

// FileRouter for your app
export const ourFileRouter = {
  // Define routes for different types of uploads
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = { id: "library-admin" };

      console.log(req);

      console.log("uploadthing middleware hit");

      return {
        userId: user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      // Return file info to the client
      return {
        url: file.ufsUrl,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
