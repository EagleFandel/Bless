#!/bin/sh
set -e

echo "🔧 Initializing database..."

# 确保数据目录存在
mkdir -p /app/data

# 运行 Prisma 迁移
npx prisma db push --skip-generate

echo "✅ Database initialized successfully!"
