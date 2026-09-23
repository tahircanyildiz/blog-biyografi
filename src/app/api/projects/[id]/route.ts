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
    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        eyebrow1: body.eyebrow1,
        eyebrow2: body.eyebrow2,
        description: body.description,
        tags: body.tags,
        mission: body.mission,
        keyFeature: body.keyFeature,
        clientName: body.clientName,
        coverImage: body.coverImage,
        liveUrl: body.liveUrl,
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
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
  }
}
