// app/api/employees/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const employees = await sql`
      SELECT id, name, email, nip, phone, jabatan, departemen, alamat, status, role, created_at
      FROM users ORDER BY created_at DESC
    `;
    return NextResponse.json({ employees });
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
    const {
      name,
      email,
      password,
      nip,
      phone,
      jabatan,
      departemen,
      alamat,
      status,
      role,
    } = body;

    const { hashPassword } = await import("@/lib/auth");
    const hashed = await hashPassword(password || "user123");

    const result = await sql`
      INSERT INTO users (name, email, password, nip, phone, jabatan, departemen, alamat, status, role)
      VALUES (${name}, ${email}, ${hashed}, ${nip}, ${phone}, ${jabatan}, ${departemen}, ${alamat}, ${status || "aktif"}, ${role || "user"})
      RETURNING *
    `;
    return NextResponse.json({ employee: result[0] }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("unique constraint")) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Gagal menambah pegawai" },
      { status: 500 },
    );
  }
}
