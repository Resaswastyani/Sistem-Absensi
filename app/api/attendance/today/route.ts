// app/api/attendance/today/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  const userId = request.headers.get("x-user-id");
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date().toISOString().split("T")[0];
  const rows = await sql`
    SELECT * FROM attendance WHERE user_id = ${userId} AND date = ${today} LIMIT 1
  `;

  return NextResponse.json({ attendance: rows[0] || null });
}
