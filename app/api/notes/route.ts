import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 获取笔记
export async function GET(request: NextRequest) {
  const deviceId = request.headers.get("x-device-id") || "default";

  try {
    const note = await prisma.note.findFirst({
      where: { deviceId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ content: note?.content || "" });
  } catch (error) {
    return NextResponse.json({ content: "" });
  }
}

// 保存笔记
export async function POST(request: NextRequest) {
  const deviceId = request.headers.get("x-device-id") || "default";
  
  try {
    const { content } = await request.json();

    const existingNote = await prisma.note.findFirst({
      where: { deviceId },
    });

    if (existingNote) {
      await prisma.note.update({
        where: { id: existingNote.id },
        data: { content },
      });
    } else {
      await prisma.note.create({
        data: { content, deviceId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
