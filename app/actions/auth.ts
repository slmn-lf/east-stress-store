"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Validasi credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Buat token dan simpan di cookie
    const token = Buffer.from(JSON.stringify({ username })).toString("base64");
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    redirect("/admin/dashboard");
  } else {
    return { error: "Username atau password salah" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/auth/login");
}
