// app/api/requests/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  try {
    let requests;
    if (userId) {
      requests = await sql`
        SELECT r.*, u.name as employee_name
        FROM requests r
        JOIN users u ON r.user_id = u.id
        WHERE r.user_id = ${userId}
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
  } catch (error) {
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
      INSERT INTO requests (user_id, type, start_date, end_date, reason, attachment_url)
      VALUES (${user_id}, ${type}, ${start_date}, ${end_date}, ${reason}, ${attachment_url})
      RETURNING *
    `;
    return NextResponse.json({ request: result[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal membuat pengajuan" },
      { status: 500 },
    );
  }
}
