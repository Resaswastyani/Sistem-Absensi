// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const totalEmployees =
    await sql`SELECT COUNT(*) as count FROM users WHERE role = 'user'`;
  const hadirToday =
    await sql`SELECT COUNT(*) as count FROM attendance WHERE date = ${today} AND status = 'hadir'`;
  const izinToday =
    await sql`SELECT COUNT(*) as count FROM attendance WHERE date = ${today} AND status IN ('izin', 'sakit')`;
  const pendingRequests =
    await sql`SELECT COUNT(*) as count FROM requests WHERE status = 'pending'`;
  const belumAbsen =
    Number(totalEmployees[0].count) -
    Number(hadirToday[0].count) -
    Number(izinToday[0].count);

  return NextResponse.json({
    stats: {
      totalEmployees: Number(totalEmployees[0].count),
      hadirToday: Number(hadirToday[0].count),
      izinSakitToday: Number(izinToday[0].count),
      pendingRequests: Number(pendingRequests[0].count),
      belumAbsen: Math.max(0, belumAbsen),
      kehadiranRate:
        totalEmployees[0].count > 0
          ? Math.round(
              (Number(hadirToday[0].count) / Number(totalEmployees[0].count)) *
                100 *
                10,
            ) / 10
          : 0,
    },
  });
}
