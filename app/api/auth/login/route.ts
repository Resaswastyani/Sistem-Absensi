// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

// Use node runtime for bcryptjs compatibility
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Dynamic import to avoid build issues
    const { sql } = await import("@/lib/db");
    const { comparePassword, createToken } = await import("@/lib/auth");

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 },
      );
    }

    // Query database
    const users = await sql`
      SELECT id, name, email, password, role, nip, jabatan, departemen, status, phone, alamat
      FROM users 
      WHERE email = ${email} 
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }

    const user = users[0];
    const valid = await comparePassword(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        nip: user.nip,
        jabatan: user.jabatan,
        departemen: user.departemen,
        status: user.status,
        phone: user.phone,
        alamat: user.alamat,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Server error: " + String(error.message || error) },
      { status: 500 },
    );
  }
}
