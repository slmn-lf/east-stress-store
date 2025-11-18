import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get contact submissions
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, data: submissions });
  } catch (err: any) {
    console.error("GET /api/contact error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Save contact submission to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: String(name),
        email: String(email),
        message: String(message),
      },
    });

    // Get CMS profile to get recipient email
    let profile = await prisma.cMSProfile.findUnique({
      where: { id: "default" },
    });

    if (!profile) {
      profile = await prisma.cMSProfile.create({
        data: {
          id: "default",
          contactRecipientEmail: "",
        },
      });
    }

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // For now, just log the submission
    console.log("Contact submission received:", {
      submissionId: submission.id,
      name,
      email,
      message,
      recipientEmail:
        profile.contactRecipientEmail || "No recipient configured",
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your message!",
      data: submission,
    });
  } catch (err: any) {
    console.error("POST /api/contact error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
