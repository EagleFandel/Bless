import { prisma } from './prisma'

export async function initDatabase() {
  try {
    // 尝试查询数据库，如果失败说明需要初始化
    await prisma.$queryRaw`SELECT 1`
    console.log('Database connection successful')
  } catch (error) {
    console.log('Database needs initialization, creating tables...')
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
      
      console.log('Database initialized successfully')
    } catch (initError) {
      console.error('Failed to initialize database:', initError)
    }
  }
}
