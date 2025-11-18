import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    let profile = await prisma.cMSProfile.findUnique({
      where: { id: "default" },
    });

    if (!profile) {
      // Create default profile if doesn't exist
      profile = await prisma.cMSProfile.create({
        data: {
          id: "default",
          heroTitle: "",
          heroSubtitle: "",
          heroCta: "",
          heroImages: [],
          about: "{}",
          contact: "{}",
          recommendedProducts: [],
        },
      });
    }

    // Transform database format to frontend format
    // Ensure images array is properly formatted with at least 3 slots
    const images = Array.isArray(profile.heroImages)
      ? [...profile.heroImages]
      : [];
    while (images.length < 3) {
      images.push("");
    }

    const responseData = {
      hero: {
        title: profile.heroTitle || "",
        subtitle: profile.heroSubtitle || "",
        cta: profile.heroCta || "",
        images: images.slice(0, 3),
      },
      about: JSON.parse(profile.about || "{}"),
      contact: JSON.parse(profile.contact || "{}"),
      contactRecipientEmail: profile.contactRecipientEmail || "",
      recommendedProducts: Array.isArray(profile.recommendedProducts)
        ? profile.recommendedProducts
        : [],
    };

    return NextResponse.json(responseData);
  } catch (err: any) {
    console.error("GET /api/cmsprofile error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { hero, about, contact, contactRecipientEmail, recommendedProducts } =
      body;

    if (!hero) {
      return NextResponse.json(
        { error: "Hero data is required" },
        { status: 400 }
      );
    }

    // Fetch existing profile to compare images
    const existingProfile = await prisma.cMSProfile.findUnique({
      where: { id: "default" },
    });

    const oldImages = existingProfile?.heroImages || [];
    const newImages = hero.images || [];

    // Identify images to delete
    const imagesToDelete = oldImages.filter(
      (img: string) => !newImages.includes(img)
    );

    // Delete unused images from Cloudinary
    for (const imageUrl of imagesToDelete) {
      const publicId = imageUrl.split("/").pop()?.split(".")[0]; // Extract public ID
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const heroImages = Array.isArray(hero.images)
      ? hero.images.filter(
          (img: string | null | undefined) =>
            img !== null && img !== undefined && img.trim() !== ""
        )
      : [];

    // Ensure we always have at least 3 slots for images (only for display, not upload)
    const displayImages = [...heroImages];
    while (displayImages.length < 3) {
      displayImages.push("");
    }

    const profile = await prisma.cMSProfile.upsert({
      where: { id: "default" },
      update: {
        heroTitle: String(hero.title || ""),
        heroSubtitle: String(hero.subtitle || ""),
        heroCta: String(hero.cta || ""),
        heroImages: heroImages.slice(0, 3), // Only save valid images
        about: JSON.stringify(about || {}),
        contact: JSON.stringify(contact || {}),
        contactRecipientEmail: String(contactRecipientEmail || ""),
        recommendedProducts: Array.isArray(recommendedProducts)
          ? recommendedProducts
          : [],
      },
      create: {
        id: "default",
        heroTitle: String(hero.title || ""),
        heroSubtitle: String(hero.subtitle || ""),
        heroCta: String(hero.cta || ""),
        heroImages: heroImages.slice(0, 3), // Only save valid images
        about: JSON.stringify(about || {}),
        contact: JSON.stringify(contact || {}),
        contactRecipientEmail: String(contactRecipientEmail || ""),
        recommendedProducts: Array.isArray(recommendedProducts)
          ? recommendedProducts
          : [],
      },
    });

    // Ensure images array is properly formatted with at least 3 slots
    const images = Array.isArray(profile.heroImages)
      ? [...profile.heroImages]
      : [];
    while (images.length < 3) {
      images.push("");
    }

    // Return in same format as before for frontend compatibility
    const responseData = {
      hero: {
        title: profile.heroTitle || "",
        subtitle: profile.heroSubtitle || "",
        cta: profile.heroCta || "",
        images: images.slice(0, 3),
      },
      about: JSON.parse(profile.about || "{}"),
      contact: JSON.parse(profile.contact || "{}"),
      contactRecipientEmail: profile.contactRecipientEmail || "",
      recommendedProducts: Array.isArray(profile.recommendedProducts)
        ? profile.recommendedProducts
        : [],
    };

    return NextResponse.json({ ok: true, data: responseData });
  } catch (err) {
    console.error("POST /api/cmsprofile error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
