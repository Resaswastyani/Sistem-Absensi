// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { comparePassword, createToken } from "@/lib/auth";

// Force edge runtime untuk avoid module caching issues
export const runtime = "edge";

export async function POST(request: Request) {
  try {
    // Parse body
    let body: any = {};
    try {
      const text = await request.text();
      console.log("Login body:", text.substring(0, 100));

      if (text) {
        body = JSON.parse(text);
      }
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

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

    // Compare password
    const valid = await comparePassword(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }

    // Create token
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
