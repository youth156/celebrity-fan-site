// 简单的静态文件服务器
const http = require('http');
const fs = require('fs');
const path = require('path');

// 服务器端口
const PORT = 8000;

// 支持的文件类型
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.txt': 'text/plain'
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 确定请求的文件路径
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html'; // 默认加载index.html
  }

  // 获取文件扩展名
  const extname = String(path.extname(filePath)).toLowerCase();
  // 设置内容类型
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  // 读取文件并发送响应
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // 文件未找到，返回404页面
        fs.readFile('./index.html', (err, fallbackContent) => {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(fallbackContent, 'utf-8');
        });
      } else {
        // 其他错误
        res.writeHead(500);
        res.end('服务器错误: ' + error.code);
      }
    } else {
      // 文件读取成功，发送内容
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}/`);
  console.log('按Ctrl+C停止服务器');
});