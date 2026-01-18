"use client";

import { useRef, useState } from "react";

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasSelection, setHasSelection] = useState(false);

  // 检查是否有选中文本
  const checkSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      setHasSelection(start !== end);
    }
  };

  // 全选
  const handleSelectAll = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      setHasSelection(true);
    }
  };

  // 粘贴
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        
        let newContent: string;
        
        if (start === end) {
          // 未选中文本：在最后换行粘贴
          newContent = content + (content ? '\n' : '') + text;
        } else {
          // 有选中文本：替换选中内容
          newContent = content.substring(0, start) + text + content.substring(end);
        }
        
        onChange(newContent);
        
        // 设置光标位置
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = start === end 
              ? newContent.length 
              : start + text.length;
            textareaRef.current.selectionStart = newPosition;
            textareaRef.current.selectionEnd = newPosition;
            textareaRef.current.focus();
          }
        }, 0);
      }
    } catch (err) {
      console.error('粘贴失败:', err);
      alert('粘贴失败，请检查浏览器权限');
    }
  };

  return (
    <div className="relative h-full flex flex-col bg-[#1a1a1a]">
      {/* 工具栏 - 手机端优化 */}
      <div className="flex justify-end gap-2 p-2 border-b border-gray-700 bg-[#0d0d0d] flex-shrink-0 overflow-x-auto">
        {hasSelection && (
          <span className="text-xs text-gray-400 self-center mr-auto whitespace-nowrap">
            已选中
          </span>
        )}
        
        <button
          onClick={handleSelectAll}
          className="px-3 py-2 bg-[#2d2d2d] border border-gray-600 rounded hover:bg-[#3d3d3d] active:bg-[#4d4d4d] transition-colors text-sm flex items-center gap-1.5 text-gray-200 whitespace-nowrap touch-manipulation"
          title="全选 (Ctrl+A)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          全选
        </button>
        
        <button
          onClick={handlePaste}
          className="px-3 py-2 bg-[#2d2d2d] border border-gray-600 rounded hover:bg-[#3d3d3d] active:bg-[#4d4d4d] transition-colors text-sm flex items-center gap-1.5 text-gray-200 whitespace-nowrap touch-manipulation"
          title={hasSelection ? "粘贴并替换选中内容" : "在末尾粘贴 (Ctrl+V)"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {hasSelection ? '替换' : '粘贴'}
        </button>
      </div>

      {/* 编辑器 - 为底部按钮留出空间 */}
      <textarea
        ref={textareaRef}
        className="editor flex-1 pb-20"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onSelect={checkSelection}
        onMouseUp={checkSelection}
        onKeyUp={checkSelection}
        onTouchEnd={checkSelection}
        placeholder="开始输入...

支持 Markdown 和 LaTeX 公式
例如: $E = mc^2$"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  );
}
