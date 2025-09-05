# MetaLinkr项目脚本使用说明

## 服务管理脚本

### 1. 环境测试脚本
- **`test-env.bat`** - 测试项目环境配置
  - 检查Java环境
  - 验证服务安装
  - 检查端口占用
  - 验证配置文件

### 2. 启动脚本
- **`start-admin-module.bat`** - 启动Admin后端服务
  - 端口: 8080
  - 支持启动、重启、停止操作

- **`start-log-module.bat`** - 启动Log后端服务
  - 端口: 8081
  - 支持启动、重启、停止操作

- **`start-admin-front.bat`** - 启动Admin前端服务
  - 端口: 5173
  - 开发模式启动

- **`start-log-front.bat`** - 启动Log前端服务
  - 端口: 5174
  - 开发模式启动

- **`start-mysql.bat`** - MySQL服务管理脚本
  - 端口: 3306
  - 支持启动、停止、重启

- **`start-nacos.bat`** - Nacos服务管理脚本
  - 端口: 8848
  - 支持启动、停止、重启

### 3. 管理脚本
- **`check-status.bat`** - 服务状态检查脚本
  - 检查所有服务的运行状态
  - 显示端口占用情况
  - 提供访问地址

- **`stop-all.bat`** - 停止所有服务脚本
  - 停止所有运行中的服务
  - 清理进程和端口

- **`restart-all.bat`** - 重启所有服务脚本
  - 先停止所有服务，然后重新启动

### 4. 使用建议

#### 首次使用
1. 运行 `start-mysql.bat` 启动MySQL
2. 运行 `start-nacos.bat` 启动Nacos
3. 运行 `start-admin-module.bat` 启动后端服务
4. 运行 `start-admin-front.bat` 启动前端服务

#### 开发调试
- 使用对应的启动脚本单独启动服务
- 使用 `check-status.bat` 检查服务状态
- 使用 `stop-all.bat` 停止所有服务

#### 生产环境
- 使用 `start-all.bat` 一键启动所有服务
- 使用 `restart-all.bat` 重启服务
- 使用 `check-status.bat` 监控服务状态

### 5. 常见问题

#### Java环境问题
- 确保Java 8+已安装
- 检查JAVA_HOME环境变量
- 验证java命令在PATH中

#### 端口占用
- 使用 `check-status.bat` 检查端口占用
- 使用 `stop-all.bat` 停止占用端口的服务

#### 配置文件问题
- 检查各服务的配置文件
- 确保数据库连接配置正确
- 验证Nacos配置

### 6. 服务访问地址
- **Nacos控制台**: http://localhost:8848/nacos
- **Admin后端API**: http://localhost:8080
- **Log后端API**: http://localhost:8081
- **Admin前端**: http://localhost:5173
- **Log前端**: http://localhost:5174

## 🐳 Docker服务管理

### 启动Docker Nacos服务
```bash
# 新版本脚本（推荐）
start-nacos.bat

# 旧版本脚本（已废弃）
start-docker-nacos.bat
```
**功能特性:**
- ✅ 自动检查Docker环境
- ✅ 检查本地MySQL服务状态
- ✅ 检查端口占用情况
- ✅ 检查本地镜像是否存在
- ✅ 智能服务健康检查
- ✅ 详细的错误处理和用户提示
- ✅ 自动清理和状态检查

**镜像版本:**
- Nacos: `latest` (当前本地版本)
- MySQL: 本地服务 (端口3306)

**使用流程:**
1. **首次使用**: 先运行 `manage-docker-images.bat` 拉取镜像
2. **启动服务**: 运行 `start-nacos.bat` 启动服务
3. **日常使用**: 直接运行 `start-nacos.bat`

### 停止Docker Nacos服务
```bash
# 新版本脚本（推荐）
stop-nacos.bat

# 旧版本脚本（已废弃）
stop-docker-nacos.bat
```
**功能特性:**
- ✅ 安全停止所有服务
- ✅ 自动清理未使用的资源
- ✅ 保留重要数据卷
- ✅ 详细的状态报告

### 检查Nacos服务状态
```bash
check-nacos.bat
```
**功能特性:**
- 🔍 检查容器运行状态
- 🌐 检查端口占用情况
- 🗄️ 检查MySQL服务状态
- 📊 测试服务健康状态
- 📦 检查Docker镜像状态
- 📋 提供详细状态总结

### Docker镜像管理
```bash
manage-docker-images.bat
```
**功能特性:**
- 📦 查看当前镜像列表
- 🔄 拉取指定版本镜像
- 🧹 清理未使用的镜像
- 🔍 检查镜像版本一致性
- 📋 交互式菜单操作

**首次使用必选操作:**
1. 运行 `manage-docker-images.bat`
2. 选择选项 `2` 拉取指定版本镜像
3. 等待镜像下载完成
4. 运行 `start-nacos.bat` 启动服务

## 注意事项
1. 所有脚本都需要在项目根目录运行
2. 确保各服务目录结构完整
3. 按顺序启动服务（MySQL → Nacos → 后端 → 前端）
4. 使用 `check-status.bat` 验证服务状态
