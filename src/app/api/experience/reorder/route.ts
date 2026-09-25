import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const ids: unknown = body?.ids;
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "ids dizisi gerekli" }, { status: 400 });
  }

  // Liste en güncel-önce (order desc) gösterildiği için, admin panelde
  // görünen sıradaki ilk öğe (index 0) en YÜKSEK order değerini almalı.
  const lastIndex = ids.length - 1;
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.experience.update({
        where: { id },
        data: { order: lastIndex - index },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
