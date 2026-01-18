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
    <div className={`preview ${isWatch ? "text-sm" : "p-6"}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
