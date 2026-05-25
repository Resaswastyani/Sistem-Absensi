// app/api/settings/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const settings =
    await sql`SELECT * FROM office_settings WHERE id = 1 LIMIT 1`;
  if (settings.length === 0) {
    return NextResponse.json({
      setting: {
        id: 1,
        name: "Kampus STMIK El Rahma",
        latitude: -7.7956,
        longitude: 110.4038,
        radius: 100,
        address: "Jl. Kaliurang KM 10, Yogyakarta",
        start_time: "07:30",
        end_time: "16:00",
      },
    });
  }
  return NextResponse.json({ setting: settings[0] });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { name, latitude, longitude, radius, address, start_time, end_time } =
    body;

  const result = await sql`
    INSERT INTO office_settings (id, name, latitude, longitude, radius, address, start_time, end_time)
    VALUES (1, ${name}, ${latitude}, ${longitude}, ${radius}, ${address}, ${start_time}, ${end_time})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      radius = EXCLUDED.radius,
      address = EXCLUDED.address,
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      updated_at = NOW()
    RETURNING *
  `;
  return NextResponse.json({ setting: result[0] });
}
