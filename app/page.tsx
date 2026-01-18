"use client";

import { useState, useEffect } from "react";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";

// 获取设备唯一标识
function getDeviceId() {
  let deviceId = localStorage.getItem("formuless-device-id");
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("formuless-device-id", deviceId);
  }
  return deviceId;
}

export default function Home() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false); // 默认预览模式
  const { isWatch, isMobile } = useDeviceDetect();

  // 保存函数
  const saveContent = (contentToSave: string) => {
    const deviceId = getDeviceId();
    
    // 同时保存到 localStorage（降级方案）
    localStorage.setItem("formuless-content", contentToSave);
    
    // 保存到服务器
    fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-device-id": deviceId,
      },
      body: JSON.stringify({ content: contentToSave }),
    }).catch(() => {
      // 静默失败，已有 localStorage 兜底
    });
  };

  // 从服务器加载内容
  useEffect(() => {
    const deviceId = getDeviceId();
    fetch("/api/notes", {
      headers: { "x-device-id": deviceId },
    })
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content || "");
        setIsLoading(false);
      })
      .catch(() => {
        // 降级到 localStorage
        const saved = localStorage.getItem("formuless-content");
        if (saved) setContent(saved);
        setIsLoading(false);
      });
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  // Apple Watch: 纯阅读模式
  if (isWatch) {
    return (
      <div className="min-h-screen bg-black text-white p-2">
        <Preview content={content} isWatch={true} />
      </div>
    );
  }

  // 手机端: 可切换的编辑/预览模式
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white relative">
        {/* 模式切换按钮 */}
        <button
          onClick={handleModeToggle}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          {isEditMode ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              预览
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑
            </>
          )}
        </button>
        
        {isEditMode ? (
          <Editor content={content} onChange={setContent} />
        ) : (
          <div className="overflow-auto bg-gray-50 min-h-screen pt-16 px-4">
            <Preview content={content} />
          </div>
        )}
      </div>
    );
  }

  // 桌面端: 默认预览模式，可切换到编辑或分栏模式
  return (
    <div className="flex h-screen relative">
      {/* 模式切换按钮 */}
      <button
        onClick={handleModeToggle}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
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
          <div className="w-1/2 border-r">
            <Editor content={content} onChange={setContent} />
          </div>
          <div className="w-1/2 overflow-auto bg-gray-50">
            <Preview content={content} />
          </div>
        </>
      ) : (
        // 预览模式：全屏预览
        <div className="w-full overflow-auto bg-gray-50 p-8">
          <Preview content={content} />
        </div>
      )}
    </div>
  );
}
