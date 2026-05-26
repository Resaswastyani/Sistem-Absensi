// app/api/attendance/today/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0];
    const rows = await sql`
      SELECT a.*, u.name as employee_name, u.email as employee_email
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ${payload.id} AND a.date = ${today}
      LIMIT 1
    `;

    return NextResponse.json({ attendance: rows[0] || null });
  } catch (error: any) {
    console.error("[ATTENDANCE TODAY] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
