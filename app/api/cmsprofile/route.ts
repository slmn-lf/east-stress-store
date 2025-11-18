import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "cmsprofile.json");

export async function GET() {
  try {
    const text = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // basic validation could go here
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
