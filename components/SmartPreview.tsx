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
  // 检测是否包含 LaTeX 语法
  const hasLatexSyntax = (str: string): boolean => {
    return /\\[a-z]+\{|[a-zA-Z]_\{|[a-zA-Z]\^\{|\\(frac|sqrt|text|omega|pi|alpha|beta|gamma|delta|times|cdot)/.test(str);
  };

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

    // 检查是否包含 LaTeX
    if (!hasLatexSyntax(line)) {
      return line;
    }

    // 智能包裹：找出所有公式片段
    // 匹配模式：反斜杠命令、下标、上标
    const formulaPattern = /(\\[a-z]+(\{[^}]*\}|\[[^\]]*\])*|[a-zA-Z0-9]+_\{[^}]*\}|[a-zA-Z0-9]+\^\{[^}]*\}|[a-zA-Z]_[a-zA-Z0-9]|[a-zA-Z]\^[a-zA-Z0-9])/g;
    
    // 替换所有公式片段
    let result = line;
    const matches = [...line.matchAll(formulaPattern)];
    
    if (matches.length > 0) {
      // 从后往前替换，避免索引错位
      for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i];
        const formula = match[0];
        const index = match.index!;
        
        // 检查前后是否已经有 $
        const before = result[index - 1];
        const after = result[index + formula.length];
        
        if (before !== '$' && after !== '$') {
          result = result.slice(0, index) + `$${formula}$` + result.slice(index + formula.length);
        }
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
