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
  // 简单粗暴但有效的方法：
  // 1. 检测是否包含 LaTeX 语法
  // 2. 如果包含，整行用 $ 包裹（除非已经有 $）
  
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

    // 检测是否包含 LaTeX 语法特征
    const hasLatex = /\\[a-z]+|[a-zA-Z0-9]_\{|[a-zA-Z0-9]\^\{|[a-zA-Z0-9]_[a-zA-Z0-9]|[a-zA-Z0-9]\^[a-zA-Z0-9]/.test(line);
    
    if (!hasLatex) {
      return line;
    }

    // 如果这行主要是中文（超过10个汉字），保持原样
    // 因为可能是说明文字，不是公式
    const chineseCount = (line.match(/[\u4e00-\u9fa5]/g) || []).length;
    if (chineseCount > 10) {
      return line;
    }

    // 整行包裹为行内公式
    return `$${line}$`;
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
