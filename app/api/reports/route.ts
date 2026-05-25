// app/api/reports/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("startDate");
  const end = searchParams.get("endDate");

  if (!start || !end) {
    return NextResponse.json(
      { error: "startDate and endDate required" },
      { status: 400 },
    );
  }

  try {
    const attendance = await sql`
      SELECT a.*, u.name as employee_name, u.nip
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.date BETWEEN ${start} AND ${end}
      ORDER BY a.date DESC
    `;

    const summary = await sql`
      SELECT 
        u.name,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE a.status = 'hadir') as hadir,
        COUNT(*) FILTER (WHERE a.status = 'izin') as izin,
        COUNT(*) FILTER (WHERE a.status = 'sakit') as sakit,
        COUNT(*) FILTER (WHERE a.status = 'libur') as libur
      FROM attendance a
      JOIN users u ON a.user_id = u.id
      WHERE a.date BETWEEN ${start} AND ${end}
      GROUP BY u.id, u.name
    `;

    return NextResponse.json({ attendance, summary });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil laporan" },
      { status: 500 },
    );
  }
}
