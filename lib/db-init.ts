import { prisma } from './prisma'

export async function initDatabase() {
  try {
    // 尝试查询 Note 表，如果表不存在会抛出错误
    await prisma.note.findFirst()
    console.log('Database tables already exist')
  } catch (error: any) {
    // 如果是表不存在的错误 (P2021)，则创建表
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      console.log('Note table does not exist, creating tables...')
      try {
        // 创建 Note 表
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Note" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "content" TEXT NOT NULL DEFAULT '',
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            "deviceId" TEXT NOT NULL
          )
        `)
        
        // 创建索引
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "Note_deviceId_idx" ON "Note"("deviceId")
        `)
        
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "Note_updatedAt_idx" ON "Note"("updatedAt")
        `)
        
        console.log('Database tables created successfully')
      } catch (initError) {
        console.error('Failed to create database tables:', initError)
        throw initError
      }
    } else {
      // 其他错误，重新抛出
      console.error('Database connection error:', error)
      throw error
    }
  }
}
