import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.role || !body?.company) {
    return NextResponse.json({ error: "role ve company gerekli" }, { status: 400 });
  }

  const count = await prisma.experience.count();
  const created = await prisma.experience.create({
    data: {
      order: count,
      role: body.role,
      company: body.company,
      employment: body.employment ?? "",
      startDate: body.startDate ?? "",
      endDate: body.endDate ?? "",
      description: body.description ?? "",
      tags: body.tags ?? "",
      stat1Label: body.stat1Label ?? "",
      stat1Value: body.stat1Value ?? "",
      stat2Label: body.stat2Label ?? "",
      stat2Value: body.stat2Value ?? "",
      stat3Label: body.stat3Label ?? "",
      stat3Value: body.stat3Value ?? "",
    },
  });

  return NextResponse.json(created, { status: 201 });
}
