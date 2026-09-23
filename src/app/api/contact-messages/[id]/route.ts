import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  try {
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { read: body?.read ?? true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
  }
}
