// app/api/attendance/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const userId = searchParams.get("userId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    let query;
    if (date) {
      query = sql`
        SELECT a.*, u.name as employee_name, u.email as employee_email, u.nip
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        WHERE a.date = ${date}
        ORDER BY a.check_in_time DESC
      `;
    } else if (startDate && endDate) {
      query = sql`
        SELECT a.*, u.name as employee_name, u.email as employee_email, u.nip
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        WHERE a.date BETWEEN ${startDate} AND ${endDate}
        ORDER BY a.date DESC, a.check_in_time DESC
      `;
    } else if (userId) {
      query = sql`
        SELECT a.*, u.name as employee_name, u.email as employee_email, u.nip
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        WHERE a.user_id = ${userId}
        ORDER BY a.date DESC
        LIMIT 30
      `;
    } else {
      query = sql`
        SELECT a.*, u.name as employee_name, u.email as employee_email, u.nip
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        ORDER BY a.date DESC, a.check_in_time DESC
        LIMIT 100
      `;
    }
    const attendance = await query;
    return NextResponse.json({ attendance });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data absensi" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      date,
      check_in_time,
      check_out_time,
      status,
      location,
      face_match,
      notes,
    } = body;

    // Upsert logic: if exists for user+date, update; else insert
    const existing = await sql`
      SELECT id FROM attendance WHERE user_id = ${user_id} AND date = ${date} LIMIT 1
    `;

    if (existing.length > 0) {
      const result = await sql`
        UPDATE attendance 
        SET check_in_time = COALESCE(${check_in_time}, check_in_time),
            check_out_time = COALESCE(${check_out_time}, check_out_time),
            status = ${status},
            location = ${location},
            face_match = ${face_match},
            notes = ${notes}
        WHERE id = ${existing[0].id}
        RETURNING *
      `;
      return NextResponse.json({ attendance: result[0] });
    } else {
      const result = await sql`
        INSERT INTO attendance (user_id, date, check_in_time, check_out_time, status, location, face_match, notes)
        VALUES (${user_id}, ${date}, ${check_in_time}, ${check_out_time}, ${status}, ${location}, ${face_match}, ${notes})
        RETURNING *
      `;
      return NextResponse.json({ attendance: result[0] }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan absensi" },
      { status: 500 },
    );
  }
}
