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
    const hasLatex = /\\[a-z]+|[a-zA-Z0-9]_\{|[a-zA-Z0-9]\^\{|[a-zA-Z0-9]_[a-zA-Z0-9]|[a-zA-Z0-9]\^[a-zA-Z0-9]|\\text\{|\\frac\{|\\sqrt|\\Delta|\\sum|\\int|\\begin\{|rightarrow|leftharpoons/.test(line);
    
    if (!hasLatex) {
      return line;
    }

    // 特殊处理：如果包含 begin{align} 或 begin{equation}，整块包裹
    if (/\\begin\{(align|equation|matrix|pmatrix|vmatrix)/.test(line)) {
      return `$$${line}$$`;
    }

    // 如果这行是纯公式（中文很少），用独立公式
    const chineseCount = (line.match(/[\u4e00-\u9fa5]/g) || []).length;
    const totalLength = line.length;
    
    // 如果中文占比小于30%，认为是公式行
    if (chineseCount < totalLength * 0.3) {
      return `$$${line}$$`;
    }

    // 否则保持原样（可能是混合文本）
    return line;
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
