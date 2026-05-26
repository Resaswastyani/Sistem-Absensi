// app/api/fix-passwords/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Proteksi: hanya jalan jika secret cocok dengan JWT_SECRET
  if (secret !== process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const adminHash = await hashPassword("admin123");
    const userHash = await hashPassword("user123");

    await sql`
      UPDATE users 
      SET password = ${adminHash} 
      WHERE email = 'admin@stmik.ac.id'
    `;

    await sql`
      UPDATE users 
      SET password = ${userHash} 
      WHERE email = 'dosen@stmik.ac.id'
    `;

    return NextResponse.json({
      success: true,
      message:
        "Password berhasil diperbarui untuk admin@stmik.ac.id dan dosen@stmik.ac.id",
    });
  } catch (error: any) {
    console.error("Fix passwords error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
