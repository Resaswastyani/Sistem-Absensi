// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = cookieHeader?.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
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
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
