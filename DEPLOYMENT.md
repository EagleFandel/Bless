# Coolify 部署指南

## 方法一：通过 Git 仓库部署（推荐）

### 1. 准备 Git 仓库
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-git-repo-url>
git push -u origin main
```

### 2. 在 Coolify 中创建应用

1. 登录 Coolify 控制台
2. 点击 **New Resource** → **Application**
3. 选择 **Git Repository**
4. 填写仓库信息：
   - Repository URL: `your-git-repo-url`
   - Branch: `main`

### 3. 配置构建设置

在 Coolify 应用设置中：

**Build Pack**: `nixpacks` 或 `dockerfile`

**环境变量**:
```env
DATABASE_URL=file:/app/data/prod.db
NODE_ENV=production
```

**持久化存储**:
- Source: `/app/data`
- Destination: `formuless-data`
- 勾选 "Persistent"

### 4. 部署
点击 **Deploy** 按钮，Coolify 会自动：
- 拉取代码
- 构建 Docker 镜像
- 运行容器
- 初始化数据库

---

## 方法二：Docker Compose 部署

### 1. 上传项目到服务器
```bash
scp -r . user@your-server:/path/to/formuless
```

### 2. SSH 到服务器
```bash
ssh user@your-server
cd /path/to/formuless
```

### 3. 在 Coolify 中添加 Docker Compose

1. 在 Coolify 中选择 **New Resource** → **Docker Compose**
2. 粘贴 `docker-compose.yml` 内容
3. 设置环境变量（如上）
4. 点击 **Deploy**

---

## 方法三：手动 Docker 部署

### 1. 构建镜像
```bash
docker build -t formuless:latest .
```

### 2. 运行容器
```bash
docker run -d \
  --name formuless \
  -p 3000:3000 \
  -v formuless-data:/app/data \
  -e DATABASE_URL=file:/app/data/prod.db \
  -e NODE_ENV=production \
  --restart unless-stopped \
  formuless:latest
```

### 3. 初始化数据库
```bash
docker exec formuless npx prisma db push --skip-generate
```

---

## 验证部署

访问 `http://your-server-ip:3000`

### 测试多设备同步
1. 手机浏览器打开并编辑内容
2. Apple Watch 打开相同地址
3. 应该能看到同步的内容

---

## 数据备份

### 备份数据库
```bash
docker exec formuless cat /app/data/prod.db > backup-$(date +%Y%m%d).db
```

### 恢复数据库
```bash
docker cp backup.db formuless:/app/data/prod.db
docker restart formuless
```

---

## 故障排查

### 查看日志
```bash
# Coolify 控制台中查看
# 或使用 Docker 命令
docker logs formuless -f
```

### 数据库问题
```bash
# 进入容器
docker exec -it formuless sh

# 检查数据库文件
ls -la /app/data/

# 重新初始化
npx prisma db push
```

### 权限问题
```bash
# 确保数据目录权限正确
docker exec formuless chown -R nextjs:nodejs /app/data
```

---

## 性能优化

### 1. 启用 HTTPS
在 Coolify 中配置 SSL 证书（自动 Let's Encrypt）

### 2. 配置域名
在 Coolify 应用设置中添加自定义域名

### 3. 资源限制
```yaml
# docker-compose.yml 中添加
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

---

## 更新应用

### Git 部署方式
```bash
git add .
git commit -m "Update"
git push
```
Coolify 会自动检测并重新部署

### 手动方式
```bash
docker pull formuless:latest
docker restart formuless
```

---

## 监控

在 Coolify 控制台可以查看：
- CPU/内存使用率
- 请求日志
- 错误日志
- 容器状态

---

## 安全建议

1. **限制访问**：使用 Coolify 的访问控制功能
2. **定期备份**：设置自动备份任务
3. **更新依赖**：定期运行 `npm update`
4. **监控日志**：关注异常访问

---

## 成本估算

- **VPS**: $5-10/月（1GB RAM 足够）
- **域名**: $10-15/年（可选）
- **SSL**: 免费（Let's Encrypt）

总计：约 $5-10/月
