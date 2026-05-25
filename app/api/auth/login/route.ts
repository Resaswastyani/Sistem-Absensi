// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { comparePassword, createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log("Login attempt:", email);

    // Cek database connection dulu
    let users;
    try {
      users = await sql`
        SELECT id, name, email, password, role, nip, jabatan, departemen, status, phone, alamat
        FROM users WHERE email = ${email} LIMIT 1
      `;
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed: " + String(dbError) },
        { status: 500 },
      );
    }

    console.log("User found:", users.length > 0);

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }

    const user = users[0];

    // Debug password comparison
    console.log("Input password:", password);
    console.log("Stored hash:", user.password.substring(0, 20) + "...");

    const valid = await comparePassword(password, user.password);
    console.log("Password valid:", valid);

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
      secure: true, // Vercel selalu HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Server error: " + String(error) },
      { status: 500 },
    );
  }
}
