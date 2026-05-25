// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

// Import dengan try-catch untuk debug
let sql: any;
let comparePassword: any;
let createToken: any;

try {
  const dbModule = require("@/lib/db");
  sql = dbModule.sql;
} catch (e) {
  console.error("Failed to import db:", e);
}

try {
  const authModule = require("@/lib/auth");
  comparePassword = authModule.comparePassword;
  createToken = authModule.createToken;
} catch (e) {
  console.error("Failed to import auth:", e);
}

export async function POST(request: Request) {
  try {
    // Check imports
    if (!sql) {
      return NextResponse.json(
        { error: "Database module not loaded" },
        { status: 500 },
      );
    }
    if (!comparePassword || !createToken) {
      return NextResponse.json(
        { error: "Auth module not loaded" },
        { status: 500 },
      );
    }

    // Parse body dengan extra care
    let body: any = {};
    try {
      const text = await request.text();
      console.log("Request body text:", text);

      if (text) {
        body = JSON.parse(text);
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON: " + String(parseError) },
        { status: 400 },
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 },
      );
    }

    console.log("Login attempt for:", email);

    // Query database
    let users: any[] = [];
    try {
      users = await sql`
        SELECT id, name, email, password, role, nip, jabatan, departemen, status, phone, alamat
        FROM users 
        WHERE email = ${email} 
        LIMIT 1
      `;
    } catch (dbError: any) {
      console.error("Database query error:", dbError);
      return NextResponse.json(
        { error: "DB Error: " + String(dbError.message || dbError) },
        { status: 500 },
      );
    }

    console.log("Users found:", users.length);

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }

    const user = users[0];

    // Compare password
    let valid = false;
    try {
      valid = await comparePassword(password, user.password);
    } catch (pwError) {
      console.error("Password compare error:", pwError);
      return NextResponse.json(
        { error: "Password error: " + String(pwError) },
        { status: 500 },
      );
    }

    console.log("Password valid:", valid);

    if (!valid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 },
      );
    }

    // Create token
    let token: string;
    try {
      token = await createToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });
    } catch (tokenError) {
      console.error("Token creation error:", tokenError);
      return NextResponse.json(
        { error: "Token error: " + String(tokenError) },
        { status: 500 },
      );
    }

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
    console.error("Unhandled login error:", error);
    return NextResponse.json(
      { error: "Server error: " + String(error.message || error) },
      { status: 500 },
    );
  }
}
