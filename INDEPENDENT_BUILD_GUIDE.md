# LinkrDev 独立打包和启动指南

## 🎯 概述

现在您可以将两个服务分别独立打包和启动，每个服务都可以独立运行，便于开发和调试。

## 📦 独立打包

### 1. Controller服务打包
```bash
# 运行打包脚本
build-controller-service.bat
```

**打包结果：**
- JAR文件位置：`LinkrMix\controller-service\target\controller-service-1.0-SNAPSHOT.jar`
- 文件大小：约30-50MB（包含所有依赖）

### 2. Dubbo服务打包
```bash
# 运行打包脚本
build-dubbo-service.bat
```

**打包结果：**
- JAR文件位置：`LinkrMix\dubbo-service\target\dubbo-service-1.0-SNAPSHOT.jar`
- 文件大小：约20-40MB（包含所有依赖）

## 🚀 独立启动

### 1. Controller服务启动
```bash
# 运行启动脚本
start-controller-service.bat
```

**服务信息：**
- 端口：8080
- 访问地址：http://localhost:8080
- 日志文件：`LinkrMix\controller-service\target\controller-service.log`

### 2. Dubbo服务启动
```bash
# 运行启动脚本
start-dubbo-service.bat
```

**服务信息：**
- 端口：20880
- 访问地址：http://localhost:20880
- 日志文件：`LinkrMix\dubbo-service\target\dubbo-service.log`

## 🔧 手动操作

### 手动打包
```bash
# 1. 先构建admin-api模块
cd LinkrMix\admin-api
mvn clean install -DskipTests

# 2. 构建Controller服务
cd ..\controller-service
mvn clean package -DskipTests

# 3. 构建Dubbo服务
cd ..\dubbo-service
mvn clean package -DskipTests
```

### 手动启动
```bash
# 启动Controller服务
java -jar LinkrMix\controller-service\target\controller-service-1.0-SNAPSHOT.jar

# 启动Dubbo服务
java -jar LinkrMix\dubbo-service\target\dubbo-service-1.0-SNAPSHOT.jar
```

## 📊 打包配置说明

### Spring Boot Maven插件配置
每个服务的`pom.xml`中都配置了Spring Boot Maven插件：

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <mainClass>com.aleks.linkrmix.controller.ControllerServiceApplication</mainClass>
        <layout>JAR</layout>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>repackage</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**关键配置：**
- `mainClass`：指定主启动类
- `repackage`：重新打包为可执行JAR
- `layout`：JAR布局

## 🎯 使用场景

### 1. 开发调试
- 可以只启动需要的服务
- 减少资源占用
- 便于问题定位

### 2. 测试部署
- 可以分别测试每个服务
- 独立部署到不同服务器
- 便于负载均衡

### 3. 生产环境
- 可以根据需要扩展特定服务
- 独立监控和运维
- 故障隔离

## ⚠️ 注意事项

### 1. 依赖关系
- 必须先构建`admin-api`模块
- 两个服务都依赖`admin-api`

### 2. 服务发现
- 如果使用Nacos，需要先启动Nacos服务
- 服务间通信需要网络连通

### 3. 数据库
- Controller服务需要MySQL数据库
- 确保数据库服务正常运行

### 4. 端口冲突
- 确保端口8080和20880未被占用
- 可以在配置文件中修改端口

## 🔍 故障排查

### 1. 打包失败
- 检查Maven是否正确安装
- 检查网络连接（下载依赖）
- 查看错误日志

### 2. 启动失败
- 检查JAR文件是否存在
- 检查端口是否被占用
- 查看启动日志

### 3. 服务无法访问
- 检查防火墙设置
- 检查服务是否正常启动
- 查看服务日志

## 📈 性能优化

### 1. JVM参数优化
```bash
# 启动时添加JVM参数
java -Xms512m -Xmx1024m -jar controller-service-1.0-SNAPSHOT.jar
```

### 2. 内存配置
- 根据服务器配置调整内存
- 监控内存使用情况
- 避免内存泄漏

### 3. 日志配置
- 配置日志级别
- 定期清理日志文件
- 使用日志轮转
