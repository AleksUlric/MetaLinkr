# 墨刀原型图爬虫使用说明

## 📋 功能说明

这个爬虫程序用于从墨刀平台获取原型设计图片，帮助分析设计风格和布局。

## 🚀 使用方法

### 方法一：使用简化版爬虫（推荐）

```bash
# 进入scripts目录
cd scripts

# 安装依赖
pip install requests

# 运行简化版爬虫
python simple_modao_scraper.py
```

### 方法二：使用完整版爬虫

```bash
# 安装依赖
pip install requests beautifulsoup4

# 运行完整版爬虫
python modaoscraper.py
```

## 📁 输出文件

爬虫会在 `modao_images` 目录中生成以下文件：

- `modao_image_1.jpg` - 下载的原型图片
- `modao_image_2.jpg` - 下载的原型图片
- `image_urls.txt` - 所有图片URL列表
- `项目ID_info.json` - 项目详细信息（完整版）

## ⚠️ 注意事项

### 法律合规
- 请确保您有权限访问和下载该原型图
- 遵守墨刀平台的使用条款
- 尊重原作者的版权

### 技术限制
- 墨刀可能有反爬虫机制
- 某些图片可能需要登录才能访问
- 建议添加适当的延迟避免被封

### 使用建议
- 仅用于学习和研究目的
- 不要用于商业用途
- 下载后请及时删除，避免版权问题

## 🔧 自定义配置

### 修改目标URL
在 `simple_modao_scraper.py` 中修改 `url` 变量：

```python
url = "您的墨刀原型链接"
```

### 修改输出目录
```python
download_modao_images(url, output_dir='您的输出目录')
```

### 添加延迟
```python
time.sleep(2)  # 增加延迟时间
```

## 🐛 常见问题

### 1. 下载失败
- 检查网络连接
- 确认URL是否正确
- 尝试添加更多延迟

### 2. 找不到图片
- 墨刀可能使用了动态加载
- 尝试使用浏览器开发者工具手动获取图片URL

### 3. 被封IP
- 减少请求频率
- 使用代理IP
- 更换User-Agent

## 📞 技术支持

如果遇到问题，请检查：
1. Python版本（建议3.7+）
2. 依赖包是否正确安装
3. 网络连接是否正常
4. 目标URL是否可访问

## 📝 免责声明

本工具仅供学习和研究使用，使用者需要：
- 遵守相关法律法规
- 尊重知识产权
- 承担使用风险
- 不得用于商业用途
