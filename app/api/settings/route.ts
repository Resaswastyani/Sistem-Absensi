// app/api/settings/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const settings = await sql`
      SELECT id, name, latitude, longitude, radius, address, start_time, end_time
      FROM office_settings 
      WHERE id = 1 
      LIMIT 1
    `;

    if (settings.length === 0) {
      // Return default settings jika belum ada di DB
      return NextResponse.json({
        settings: {
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

    return NextResponse.json({ settings: settings[0] });
  } catch (error: any) {
    console.error("[SETTINGS GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, latitude, longitude, radius, address, start_time, end_time } =
      body;

    // Validasi required fields
    if (
      name === undefined ||
      latitude === undefined ||
      longitude === undefined ||
      radius === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO office_settings (id, name, latitude, longitude, radius, address, start_time, end_time)
      VALUES (1, ${name}, ${latitude}, ${longitude}, ${radius}, ${address || ""}, ${start_time || "07:30"}, ${end_time || "16:00"})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        radius = EXCLUDED.radius,
        address = EXCLUDED.address,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time
      RETURNING id, name, latitude, longitude, radius, address, start_time, end_time
    `;

    return NextResponse.json({ settings: result[0] });
  } catch (error: any) {
    console.error("[SETTINGS PUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to update settings: " + String(error.message || error) },
      { status: 500 },
    );
  }
}
