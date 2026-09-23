import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Ad, e-posta ve mesaj alanları gerekli" },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Geçersiz e-posta adresi" }, { status: 400 });
  }

  const created = await prisma.contactMessage.create({
    data: { name, email, message },
  });

  await sendContactNotification({ name, email, message });

  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
