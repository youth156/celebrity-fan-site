const fs = require('fs');
const path = require('path');

// 读取HTML文件
const htmlContent = fs.readFileSync('./community.html', 'utf8');

// 提取所有script标签内容
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
let match;
let scriptIndex = 0;

console.log('开始检查JavaScript语法错误...');

while ((match = scriptRegex.exec(htmlContent)) !== null) {
    const scriptContent = match[1];
    const startLine = htmlContent.substring(0, match.index).split('\n').length;
    
    // 忽略包含src属性的script标签（外部脚本）
    if (!match[0].includes('src=')) {
        scriptIndex++;
        console.log(`\n检查脚本块 #${scriptIndex} (起始行: ${startLine})`);
        
        // 逐行检查
        const lines = scriptContent.split('\n');
        let accumulatedCode = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            accumulatedCode += line + '\n';
            
            try {
                // 尝试编译当前累积的代码
                new Function(accumulatedCode);
            } catch (error) {
                console.error(`错误在脚本块 #${scriptIndex} 的第 ${i + 1} 行 (HTML中的大致行号: ${startLine + i}):`);
                console.error(`行内容: ${line}`);
                console.error(`错误信息: ${error.message}`);
                break;
            }
        }
    }
}

console.log('\n语法检查完成！');