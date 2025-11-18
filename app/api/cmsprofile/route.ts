import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const { hero, about, contact, contactRecipientEmail, recommendedProducts } = body;

    if (!hero) {
      return NextResponse.json(
        { error: "Hero data is required" },
        { status: 400 }
      );
    }

    // Validate and keep all images including empty strings
    const heroImages = Array.isArray(hero.images)
      ? hero.images.filter((img: any) => img !== null && img !== undefined)
      : [];

    // Ensure we always have at least 3 slots for images
    while (heroImages.length < 3) {
      heroImages.push("");
    }

    const profile = await prisma.cMSProfile.upsert({
      where: { id: "default" },
      update: {
        heroTitle: String(hero.title || ""),
        heroSubtitle: String(hero.subtitle || ""),
        heroCta: String(hero.cta || ""),
        heroImages: heroImages.slice(0, 3),
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
        heroImages: heroImages.slice(0, 3),
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
  } catch (err: any) {
    console.error("POST /api/cmsprofile error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
