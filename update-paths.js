const fs = require('fs');
const path = require('path');

// 读取压缩后的 HTML 文件
let htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 更新资源引用路径
html = html.replace(/href="\.\/css\/style\.css"/g, 'href="./css/style.min.css"');
html = html.replace(/src="js\/game\.js"/g, 'src="./js/game.min.js"');

// 保存更新后的 HTML 文件
fs.writeFileSync(htmlPath, html);

console.log('资源路径更新完成！'); 