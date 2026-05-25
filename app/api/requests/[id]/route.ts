// app/api/requests/[id]/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const { status } = body; // 'approved' | 'rejected'

  const result = await sql`
    UPDATE requests SET status = ${status} WHERE id = ${params.id} RETURNING *
  `;
  return NextResponse.json({ request: result[0] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  await sql`DELETE FROM requests WHERE id = ${params.id}`;
  return NextResponse.json({ success: true });
}
