import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "contacts.json");

async function ensureFile() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify([]), "utf8");
  }
}

export async function GET() {
  try {
    await ensureFile();
    const text = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureFile();
    const body = await req.json();
    const text = await fs.readFile(filePath, "utf8");
    const arr = JSON.parse(text);
    arr.push({ ...body, createdAt: new Date().toISOString() });
    await fs.writeFile(filePath, JSON.stringify(arr, null, 2), "utf8");
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
