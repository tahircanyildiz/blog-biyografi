import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const ids: unknown = body?.ids;
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "ids dizisi gerekli" }, { status: 400 });
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.skillGroup.update({ where: { id }, data: { order: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
