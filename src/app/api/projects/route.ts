import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.title) {
    return NextResponse.json({ error: "title gerekli" }, { status: 400 });
  }

  const count = await prisma.project.count();
  const created = await prisma.project.create({
    data: {
      order: count,
      title: body.title,
      eyebrow1: body.eyebrow1 ?? "",
      eyebrow2: body.eyebrow2 ?? "",
      description: body.description ?? "",
      tags: body.tags ?? "",
      mission: body.mission ?? "",
      keyFeature: body.keyFeature ?? "",
      clientName: body.clientName ?? "",
      coverImage: body.coverImage ?? "",
      liveUrl: body.liveUrl ?? "",
    },
  });

  return NextResponse.json(created, { status: 201 });
}
