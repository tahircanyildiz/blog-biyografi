import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek gövdesi" }, { status: 400 });
  }

  try {
    const updated = await prisma.education.update({
      where: { id },
      data: {
        icon: body.icon,
        title: body.title,
        institution: body.institution,
        period: body.period,
        type: body.type,
        bullets: body.bullets,
      },
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
    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
  }
}
