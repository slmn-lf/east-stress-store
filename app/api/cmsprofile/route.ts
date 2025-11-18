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
    const responseData = {
      hero: {
        title: profile.heroTitle,
        subtitle: profile.heroSubtitle,
        cta: profile.heroCta,
        images: profile.heroImages,
      },
      about: JSON.parse(profile.about || "{}"),
      contact: JSON.parse(profile.contact || "{}"),
      recommendedProducts: profile.recommendedProducts,
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

    const { hero, about, contact, recommendedProducts } = body;

    if (!hero) {
      return NextResponse.json(
        { error: "Hero data is required" },
        { status: 400 }
      );
    }

    const profile = await prisma.cMSProfile.upsert({
      where: { id: "default" },
      update: {
        heroTitle: hero.title || "",
        heroSubtitle: hero.subtitle || "",
        heroCta: hero.cta || "",
        heroImages: hero.images || [],
        about: JSON.stringify(about || {}),
        contact: JSON.stringify(contact || {}),
        recommendedProducts: recommendedProducts || [],
      },
      create: {
        id: "default",
        heroTitle: hero.title || "",
        heroSubtitle: hero.subtitle || "",
        heroCta: hero.cta || "",
        heroImages: hero.images || [],
        about: JSON.stringify(about || {}),
        contact: JSON.stringify(contact || {}),
        recommendedProducts: recommendedProducts || [],
      },
    });

    // Return in same format as before for frontend compatibility
    const responseData = {
      hero: {
        title: profile.heroTitle,
        subtitle: profile.heroSubtitle,
        cta: profile.heroCta,
        images: profile.heroImages,
      },
      about: JSON.parse(profile.about || "{}"),
      contact: JSON.parse(profile.contact || "{}"),
      recommendedProducts: profile.recommendedProducts,
    };

    return NextResponse.json({ ok: true, data: responseData });
  } catch (err: any) {
    console.error("POST /api/cmsprofile error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

