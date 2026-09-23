import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.platform || !body?.url) {
    return NextResponse.json({ error: "platform ve url gerekli" }, { status: 400 });
  }

  const count = await prisma.socialLink.count();
  const created = await prisma.socialLink.create({
    data: {
      order: count,
      platform: body.platform,
      url: body.url,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
