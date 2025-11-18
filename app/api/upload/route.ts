import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "pre-order/products",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            resolve(
              NextResponse.json(
                { success: false, error: "Failed to upload image" },
                { status: 500 }
              )
            );
          } else if (result && "secure_url" in result) {
            console.log("Image uploaded successfully:", result.secure_url);
            resolve(
              NextResponse.json({
                success: true,
                url: result.secure_url,
              })
            );
          } else {
            resolve(
              NextResponse.json(
                { success: false, error: "Invalid upload response" },
                { status: 500 }
              )
            );
          }
        }
      );

      uploadStream.on("error", (err) => {
        console.error("Upload stream error:", err);
        resolve(
          NextResponse.json(
            { success: false, error: "Upload stream error" },
            { status: 500 }
          )
        );
      });

      uploadStream.end(buffer);
    }) as Promise<Response>;
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
