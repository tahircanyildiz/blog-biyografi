import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.skillGroup.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.category) {
    return NextResponse.json({ error: "category gerekli" }, { status: 400 });
  }

  const count = await prisma.skillGroup.count();
  const created = await prisma.skillGroup.create({
    data: {
      order: count,
      category: body.category,
      subcategory: body.subcategory ?? "",
      items: body.items ?? "",
    },
  });

  return NextResponse.json(created, { status: 201 });
}
