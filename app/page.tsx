"use client";

import { useState, useEffect } from "react";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import PullToRefreshIndicator from "@/components/PullToRefresh";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

// 单用户模式 - 固定使用同一个 ID
const SINGLE_USER_ID = "default-user";

export default function Home() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false); // 默认预览模式
  const { isWatch, isMobile } = useDeviceDetect();

  // 从服务器加载内容
  const loadContent = async () => {
    try {
      const res = await fetch("/api/notes", {
        headers: { "x-device-id": SINGLE_USER_ID },
      });
      const data = await res.json();
      setContent(data.content || "");
    } catch {
      // 降级到 localStorage
      const saved = localStorage.getItem("formuless-content");
      if (saved) setContent(saved);
    }
  };

  // 下拉刷新
  const handleRefresh = async () => {
    await loadContent();
  };

  const pullToRefresh = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
  });

  // 保存函数
  const saveContent = (contentToSave: string) => {
    // 同时保存到 localStorage（降级方案）
    localStorage.setItem("formuless-content", contentToSave);
    
    // 保存到服务器（单用户模式）
    fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-device-id": SINGLE_USER_ID,
      },
      body: JSON.stringify({ content: contentToSave }),
    }).catch(() => {
      // 静默失败，已有 localStorage 兜底
    });
  };

  // 从服务器加载内容
  useEffect(() => {
    loadContent().finally(() => setIsLoading(false));
  }, []);

  // 自动保存到服务器
  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      saveContent(content);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [content, isLoading]);

  // 切换模式时立即保存
  const handleModeToggle = () => {
    saveContent(content);
    setIsEditMode(!isEditMode);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  // Apple Watch: 纯阅读模式 - 优化超小屏幕显示
  if (isWatch) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white p-1">
        <div className="preview-watch">
          <Preview content={content} isWatch={true} />
        </div>
      </div>
    );
  }

  // 手机端: 默认编辑模式，可切换到预览
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] relative">
        {/* 下拉刷新指示器 */}
        <PullToRefreshIndicator {...pullToRefresh} />
        
        {/* 模式切换按钮 - 手机端优化 */}
        <button
          onClick={handleModeToggle}
          className="fixed top-3 right-3 z-50 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-sm"
        >
          {isEditMode ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              预览
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑
            </>
          )}
        </button>
        
        {isEditMode ? (
          <Editor content={content} onChange={setContent} />
        ) : (
          <div className="overflow-auto bg-[#1a1a1a] min-h-screen pt-14 px-3">
            <Preview content={content} />
          </div>
        )}
      </div>
    );
  }

  // 桌面端: 默认预览模式，可切换到编辑或分栏模式
  return (
    <div className="flex h-screen relative bg-[#1a1a1a]">
      {/* 模式切换按钮 */}
      <button
        onClick={handleModeToggle}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        {isEditMode ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            预览模式
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            编辑模式
          </>
        )}
      </button>

      {isEditMode ? (
        // 编辑模式：左右分栏
        <>
          <div className="w-1/2 border-r border-gray-700">
            <Editor content={content} onChange={setContent} />
          </div>
          <div className="w-1/2 overflow-auto bg-[#1a1a1a]">
            <Preview content={content} />
          </div>
        </>
      ) : (
        // 预览模式：全屏预览
        <div className="w-full overflow-auto bg-[#1a1a1a] p-8">
          <Preview content={content} />
        </div>
      )}
    </div>
  );
}
