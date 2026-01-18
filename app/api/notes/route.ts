import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initDatabase } from "@/lib/db-init";

let dbInitialized = false;

// 确保数据库已初始化
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// 单用户模式 - 固定使用同一个 ID
const SINGLE_USER_ID = "default-user";

// 获取笔记
export async function GET(request: NextRequest) {
  await ensureDbInitialized();

  try {
    const note = await prisma.note.findFirst({
      where: { deviceId: SINGLE_USER_ID },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ content: note?.content || "" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ content: "" });
  }
}

// 保存笔记
export async function POST(request: NextRequest) {
  await ensureDbInitialized();
  
  try {
    const { content } = await request.json();

    const existingNote = await prisma.note.findFirst({
      where: { deviceId: SINGLE_USER_ID },
    });

    if (existingNote) {
      await prisma.note.update({
        where: { id: existingNote.id },
        data: { content },
      });
    } else {
      await prisma.note.create({
        data: { content, deviceId: SINGLE_USER_ID },
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
