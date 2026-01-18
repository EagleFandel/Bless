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
    <div 
      className={`preview ${isWatch ? "preview-watch" : ""}`} 
      style={
        isWatch 
          ? { paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: 0, paddingRight: 0, width: '100%', boxSizing: 'border-box' }
          : { paddingTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: 0, paddingRight: 0 }
      }
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // 优化 Apple Watch 上的标题显示
          h1: ({ node, ...props }) => (
            <h1 {...props} style={isWatch ? { fontSize: '1.69em' } : undefined} />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} style={isWatch ? { fontSize: '1.56em' } : undefined} />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} style={isWatch ? { fontSize: '1.43em' } : undefined} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
