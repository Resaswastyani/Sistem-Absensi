import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const result =
      await sql`SELECT NOW() as time, current_database() as db, COUNT(*) as user_count FROM users`;
    return NextResponse.json({
      success: true,
      time: result[0].time,
      database: result[0].db,
      userCount: result[0].user_count,
      env_set: !!process.env.DATABASE_URL,
    });
  } catch (error) {
    console.error("DB Test Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        env_set: !!process.env.DATABASE_URL,
      },
      { status: 500 },
    );
  }
}
