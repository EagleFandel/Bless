"use client";

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  return (
    <textarea
      className="editor"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder="开始输入...

支持 Markdown 和 LaTeX 公式
例如: $E = mc^2$"
      spellCheck={false}
    />
  );
}
