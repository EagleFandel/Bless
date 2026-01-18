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
  // 常见的 LaTeX 命令模式
  const latexPatterns = [
    /\\frac\{[^}]+\}\{[^}]+\}/g,
    /\\sqrt(\[[^\]]+\])?\{[^}]+\}/g,
    /\\text\{[^}]+\}/g,
    /[a-zA-Z]_\{[^}]+\}/g,
    /[a-zA-Z]\^\{[^}]+\}/g,
    /\\(alpha|beta|gamma|delta|omega|pi|theta|sigma|Delta|Sigma|Omega)/g,
    /\\(times|cdot|div|neq|approx|infty|in|cup|cap|subseteq|varnothing)/g,
    /\\(lim|sum|int|partial|nabla)(_\{[^}]+\})?(\^\{[^}]+\})?/g,
    /\\(vec|bar|hat|tilde)\{[^}]+\}/g,
    /\\(xrightarrow|stackrel)\{[^}]+\}/g,
    /\\begin\{(matrix|pmatrix|vmatrix)\}[\s\S]*?\\end\{\1\}/g,
  ];

  let result = text;
  
  // 分行处理
  const lines = result.split('\n');
  const processedLines = lines.map(line => {
    // 跳过已经有 $ 的行
    if (line.includes('$')) {
      return line;
    }

    // 检查是否包含 LaTeX 命令
    let hasLatex = false;
    for (const pattern of latexPatterns) {
      if (pattern.test(line)) {
        hasLatex = true;
        break;
      }
    }

    if (hasLatex) {
      // 如果整行都是公式（没有太多中文），用独立公式
      const chineseCount = (line.match(/[\u4e00-\u9fa5]/g) || []).length;
      if (chineseCount < 5) {
        return `$$${line}$$`;
      } else {
        // 行内有中文，智能包裹公式部分
        return line.replace(
          /(\\[a-z]+(\{[^}]+\}|\[[^\]]+\])*|[a-zA-Z][\^_]\{[^}]+\})/g,
          '$$$1$$'
        );
      }
    }

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
