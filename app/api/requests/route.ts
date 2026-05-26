// app/api/requests/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("userId");
    const status = searchParams.get("status");

    // Jika ada userId di query, gunakan itu (untuk user biasa)
    // Jika tidak, cek token untuk admin yang bisa lihat semua
    let targetUserId = userIdParam;

    if (!targetUserId) {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload && payload.id) {
          targetUserId = String(payload.id);
        }
      }
    }

    let requests;
    if (targetUserId) {
      requests = await sql`
        SELECT r.*, u.name as employee_name
        FROM requests r
        JOIN users u ON r.user_id = u.id
        WHERE r.user_id = ${targetUserId}
        ORDER BY r.created_at DESC
      `;
    } else if (status) {
      requests = await sql`
        SELECT r.*, u.name as employee_name
        FROM requests r
        JOIN users u ON r.user_id = u.id
        WHERE r.status = ${status}
        ORDER BY r.created_at DESC
      `;
    } else {
      requests = await sql`
        SELECT r.*, u.name as employee_name
        FROM requests r
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
      `;
    }
    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error("[REQUESTS GET] Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, type, start_date, end_date, reason, attachment_url } =
      body;

    const result = await sql`
      INSERT INTO requests (user_id, type, start_date, end_date, reason, attachment_url, status)
      VALUES (${user_id}, ${type}, ${start_date}, ${end_date}, ${reason}, ${attachment_url || null}, 'pending')
      RETURNING *
    `;
    return NextResponse.json({ request: result[0] }, { status: 201 });
  } catch (error: any) {
    console.error("[REQUESTS POST] Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat pengajuan" },
      { status: 500 },
    );
  }
}
