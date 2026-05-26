// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { sql } = await import("@/lib/db");
    const { comparePassword, createToken } = await import("@/lib/auth");

    const body = await request.json();
    const email = (body.email || "").toString().trim().toLowerCase();
    const password = (body.password || "").toString();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 },
      );
    }

    const users = await sql`
      SELECT id, name, email, password, role, nip, jabatan, departemen, status, phone, alamat
      FROM users 
      WHERE email ILIKE ${email} 
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }

    const user = users[0];
    const passwordHash = user.password ? user.password.toString() : "";

    if (!passwordHash) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }

    let valid = false;
    try {
      valid = await comparePassword(password, passwordHash);
    } catch (err) {
      console.error("[LOGIN] bcrypt compare error:", err);
    }

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

    // Clear old token first, then set new
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
