import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.education.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.title) {
    return NextResponse.json({ error: "title gerekli" }, { status: 400 });
  }

  const count = await prisma.education.count();
  const created = await prisma.education.create({
    data: {
      order: count,
      icon: body.icon ?? "",
      title: body.title,
      institution: body.institution ?? "",
      period: body.period ?? "",
      type: body.type ?? "",
      bullets: body.bullets ?? "",
    },
  });

  return NextResponse.json(created, { status: 201 });
}
