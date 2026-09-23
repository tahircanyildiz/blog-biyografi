import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Geçersiz istek gövdesi" }, { status: 400 });
  }

  const {
    firstName,
    lastName,
    roleTitle,
    tagline,
    bio,
    statYearsLabel,
    statYearsValue,
    statProjLabel,
    statProjValue,
    statLocLabel,
    location,
    profileImage,
    email,
    githubUrl,
    linkedinUrl,
    footerNote,
  } = body;

  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      firstName,
      lastName,
      roleTitle,
      tagline,
      bio,
      statYearsLabel,
      statYearsValue,
      statProjLabel,
      statProjValue,
      statLocLabel,
      location,
      profileImage,
      email,
      githubUrl,
      linkedinUrl,
      footerNote,
    },
    create: {
      id: 1,
      firstName,
      lastName,
      roleTitle,
      tagline,
      bio,
      statYearsLabel,
      statYearsValue,
      statProjLabel,
      statProjValue,
      statLocLabel,
      location,
      profileImage,
      email,
      githubUrl,
      linkedinUrl,
      footerNote,
    },
  });

  return NextResponse.json(settings);
}
