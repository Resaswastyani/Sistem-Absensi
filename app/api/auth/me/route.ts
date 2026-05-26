// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const users = await sql`
      SELECT id, name, email, role, nip, jabatan, departemen, status, phone, alamat
      FROM users WHERE id = ${payload.id} LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { user: null, error: "Server error" },
      { status: 500 },
    );
  }
}
