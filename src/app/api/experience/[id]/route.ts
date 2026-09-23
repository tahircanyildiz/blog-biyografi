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
    const updated = await prisma.experience.update({
      where: { id },
      data: {
        role: body.role,
        company: body.company,
        employment: body.employment,
        startDate: body.startDate,
        endDate: body.endDate,
        description: body.description,
        tags: body.tags,
        stat1Label: body.stat1Label,
        stat1Value: body.stat1Value,
        stat2Label: body.stat2Label,
        stat2Value: body.stat2Value,
        stat3Label: body.stat3Label,
        stat3Value: body.stat3Value,
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
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
  }
}
