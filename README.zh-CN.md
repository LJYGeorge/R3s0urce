# 网站资源爬虫工具

一个现代化的网站资源爬取工具，具有可配置选项和实时进度追踪功能。

## 工作原理

### 1. 系统架构

本项目分为两个主要部分：
- **前端界面**：React + TypeScript构建的用户界面
- **爬虫核心**：基于Playwright的自动化爬虫引擎

### 2. 爬虫工作流程

1. **浏览器自动化**
   - 使用Playwright启动真实Chrome浏览器
   - 模拟真实用户行为，避免反爬虫检测
   - 支持完整的JavaScript渲染和动态内容

2. **资源检测流程**
   ```mermaid
   graph TD
   A[输入URL] --> B[启动浏览器]
   B --> C[加载页面]
   C --> D[监听网络请求]
   D --> E[过滤资源]
   E --> F[下载资源]
   ```

3. **反检测机制**
   - 随机User-Agent
   - 模拟地理位置
   - 自定义请求头
   - Cookie管理
   - 指纹伪装

### 3. 运行环境要求

#### 本地开发环境
- Node.js 18+
- Chrome/Chromium浏览器
- wget（用于资源下载）
- 足够的磁盘空间

#### 服务器部署环境
- Linux/Windows服务器
- Node.js运行环境
- Chrome/Chromium（无头模式）
- wget命令行工具

### 4. 权限说明

1. **浏览器权限**
   - Playwright会自动处理浏览器权限
   - 包括：地理位置、Cookie、localStorage等

2. **文件系统权限**
   ```bash
   # Linux/Mac设置存储目录权限
   sudo mkdir -p /var/www/crawler/downloads
   sudo chown -R $USER:$USER /var/www/crawler/downloads
   sudo chmod 755 /var/www/crawler/downloads
   
   # Windows设置权限
   icacls "C:\crawler\downloads" /grant Users:(OI)(CI)F
   ```

3. **网络访问权限**
   - 确保服务器可以访问目标网站
   - 检查防火墙设置
   - 配置代理（如需要）

### 5. 命令执行说明

1. **本地命令**
   - wget下载命令在本地执行
   - 浏览器自动化在本地运行
   - 文件保存在本地目录

2. **服务器命令**
   ```bash
   # 安装依赖
   apt-get update
   apt-get install -y wget chromium-browser
   
   # 设置环境变量
   export CHROME_PATH=/usr/bin/chromium-browser
   export CRAWLER_SAVE_PATH=/var/www/crawler/downloads
   ```

## 功能特点

- 🚀 现代化界面，实时显示爬取进度
- 📊 资源统计和类型分析
- 🎯 可配置的爬取选项
- 💾 自动资源下载
- 📝 实时控制台日志
- 🔒 内置反检测措施

## 安装配置

### 1. 本地开发环境

```bash
# 克隆项目
git clone <项目地址>

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2. 服务器部署

```bash
# 安装系统依赖
sudo apt-get update
sudo apt-get install -y wget chromium-browser

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 配置项目
npm install
npm run build

# 设置环境变量
echo "export CHROME_PATH=/usr/bin/chromium-browser" >> ~/.bashrc
echo "export CRAWLER_SAVE_PATH=/var/www/crawler/downloads" >> ~/.bashrc
source ~/.bashrc
```

## 使用指南

### 1. 基本配置

1. **浏览器设置**
   ```javascript
   {
     headless: false,        // 是否使用无头模式
     viewport: {             // 浏览器窗口大小
       width: 1280,
       height: 800
     },
     userAgent: "...",      // 自定义User-Agent
     geolocation: {         // 地理位置模拟
       latitude: 37.5665,
       longitude: 126.9780
     }
   }
   ```

2. **资源过滤**
   ```javascript
   {
     includeImages: true,   // 包含图片
     includeStyles: true,   // 包含样式表
     includeScripts: true,  // 包含脚本
     maxDepth: 2           // 最大爬取深度
   }
   ```

### 2. 访问权限配置

1. **Cookie处理**
   ```javascript
   // 设置自定义Cookie
   await context.addCookies([{
     name: 'session',
     value: 'your-session-id',
     domain: '.example.com',
     path: '/'
   }]);
   ```

2. **请求头配置**
   ```javascript
   // 自定义请求头
   const headers = {
     'Accept-Language': 'zh-CN,zh;q=0.9',
     'Referer': 'https://www.google.com/',
     'User-Agent': '...'
   };
   ```

### 3. 存储配置

1. **本地存储**
   ```bash
   # 设置存储路径
   export CRAWLER_SAVE_PATH="/path/to/downloads"
   
   # 创建目录结构
   mkdir -p $CRAWLER_SAVE_PATH/{images,styles,scripts}
   ```

2. **权限设置**
   ```bash
   # 设置目录权限
   chmod -R 755 $CRAWLER_SAVE_PATH
   chown -R $USER:$USER $CRAWLER_SAVE_PATH
   ```

## 故障排除

### 1. 常见问题

1. **无法启动浏览器**
   - 检查Chrome/Chromium安装
   - 验证环境变量设置
   - 查看系统依赖是否完整

2. **资源下载失败**
   - 确认wget可用性
   - 检查存储权限
   - 验证网络连接

3. **内存占用过高**
   - 调整并发数
   - 限制爬取深度
   - 增加系统交换空间

### 2. 调试方法

1. **开启详细日志**
   ```javascript
   const browser = await chromium.launch({
     headless: false,
     logger: {
       isEnabled: () => true,
       log: (name, severity, message) => console.log(`${name} ${severity}: ${message}`)
     }
   });
   ```

2. **网络请求监控**
   ```javascript
   // 监听所有网络请求
   page.on('request', request => {
     console.log(`>> ${request.method()} ${request.url()}`);
   });
   ```

## 技术支持

如遇到问题，请：
1. 查看控制台输出
2. 检查系统日志
3. 参考故障排除指南
4. 提交Issue获取帮助

## 许可证

MIT许可证 - 可自由用于个人或商业项目。