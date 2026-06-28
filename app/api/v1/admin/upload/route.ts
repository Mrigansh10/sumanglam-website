import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";
import { errors, handleRoute, ok } from "@/lib/api/response";
import { getServerEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const env = getServerEnv();
    if (!env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
      return errors.badRequest("Cloudinary credentials not configured.");
    }

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });

    const formData = await request.formData();
    const folder = (formData.get("folder") as string | null) ?? "sumanglam";
    const remoteUrl = formData.get("url") as string | null;
    const file = formData.get("file") as File | null;

    let result: { public_id: string; secure_url: string };

    if (remoteUrl) {
      // Cloudinary fetches the remote URL directly — no download needed on our end
      try {
        result = await cloudinary.uploader.upload(remoteUrl, {
          folder,
          resource_type: "image",
        });
      } catch {
        return errors.badRequest("Could not fetch image from that URL. Try downloading and uploading the file instead.");
      }
    } else if (file && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) {
        return errors.badRequest("Image exceeds Cloudinary's 10 MB limit. Large photos are normally optimized automatically in the browser — try re-selecting the file.");
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      try {
        result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder, resource_type: "image" }, (error, res) => {
              if (error || !res) return reject(error ?? new Error("Upload failed"));
              resolve(res);
            })
            .end(buffer);
        });
      } catch (e) {
        return errors.badRequest(e instanceof Error ? e.message : "Upload failed.");
      }
    } else {
      return errors.badRequest("Provide either a file or a URL.");
    }

    return ok({ publicId: result.public_id, url: result.secure_url });
  });
}
