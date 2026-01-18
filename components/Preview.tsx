"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface PreviewProps {
  content: string;
  isWatch?: boolean;
}

export default function Preview({ content, isWatch = false }: PreviewProps) {
  return (
    <div className={`preview p-6 ${isWatch ? "text-sm" : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
