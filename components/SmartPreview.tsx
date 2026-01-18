"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface SmartPreviewProps {
  content: string;
  isWatch?: boolean;
}

// 自动识别并包裹 LaTeX 公式
function autoWrapLatex(text: string): string {
  // 分行处理
  const lines = text.split('\n');
  const processedLines = lines.map(line => {
    // 跳过已经有 $ 的行
    if (line.includes('$')) {
      return line;
    }

    // 跳过空行
    if (!line.trim()) {
      return line;
    }

    // 匹配所有 LaTeX 模式
    // 1. 反斜杠命令：\frac{}{}, \sqrt{}, \text{}, \alpha, \omega 等
    // 2. 下标：x_{1}, U_2
    // 3. 上标：x^{2}, x^2
    // 4. begin...end 块
    const patterns = [
      // begin...end 块（最优先，避免被拆分）
      /\\begin\{[^}]+\}[\s\S]*?\\end\{[^}]+\}/g,
      // 带大括号的命令：\frac{a}{b}, \sqrt{x}, \text{Hz}
      /\\[a-z]+\{[^}]*\}(\{[^}]*\})*/g,
      // 单个反斜杠命令：\alpha, \omega, \pi
      /\\[a-z]+/g,
      // 下标（带大括号）：x_{1}
      /[a-zA-Z0-9]+_\{[^}]+\}/g,
      // 下标（不带大括号）：x_1
      /[a-zA-Z0-9]+_[a-zA-Z0-9]/g,
      // 上标（带大括号）：x^{2}
      /[a-zA-Z0-9]+\^\{[^}]+\}/g,
      // 上标（不带大括号）：x^2
      /[a-zA-Z0-9]+\^[a-zA-Z0-9]/g,
    ];

    let result = line;
    let offset = 0;

    // 收集所有匹配位置
    const allMatches: Array<{ start: number; end: number; text: string }> = [];
    
    patterns.forEach(pattern => {
      const matches = [...line.matchAll(pattern)];
      matches.forEach(match => {
        if (match.index !== undefined) {
          allMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0]
          });
        }
      });
    });

    // 按位置排序并去重重叠部分
    allMatches.sort((a, b) => a.start - b.start);
    const merged: typeof allMatches = [];
    
    allMatches.forEach(match => {
      if (merged.length === 0) {
        merged.push(match);
      } else {
        const last = merged[merged.length - 1];
        // 如果不重叠，添加
        if (match.start >= last.end) {
          merged.push(match);
        } else if (match.end > last.end) {
          // 如果部分重叠且当前更长，替换
          last.end = match.end;
          last.text = line.substring(last.start, last.end);
        }
      }
    });

    // 从后往前替换，避免索引变化
    for (let i = merged.length - 1; i >= 0; i--) {
      const match = merged[i];
      const before = result[match.start - 1];
      const after = result[match.end];
      
      // 确保不重复包裹
      if (before !== '$' && after !== '$') {
        result = result.substring(0, match.start) + 
                 `$${match.text}$` + 
                 result.substring(match.end);
      }
    }

    return result;
  });

  return processedLines.join('\n');
}

export default function SmartPreview({ content, isWatch = false }: SmartPreviewProps) {
  const processedContent = autoWrapLatex(content);

  return (
    <div className={`preview ${isWatch ? "text-sm" : "p-6"}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
