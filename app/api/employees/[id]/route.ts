// app/api/employees/[id]/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const employees =
    await sql`SELECT * FROM users WHERE id = ${params.id} LIMIT 1`;
  if (employees.length === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ employee: employees[0] });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const { name, email, nip, phone, jabatan, departemen, alamat, status, role } =
    body;

  const result = await sql`
    UPDATE users 
    SET name=${name}, email=${email}, nip=${nip}, phone=${phone}, jabatan=${jabatan}, 
        departemen=${departemen}, alamat=${alamat}, status=${status}, role=${role}, updated_at=NOW()
    WHERE id = ${params.id}
    RETURNING *
  `;
  return NextResponse.json({ employee: result[0] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  await sql`DELETE FROM users WHERE id = ${params.id}`;
  return NextResponse.json({ success: true });
}
