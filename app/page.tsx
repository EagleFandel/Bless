"use client";

import { useState, useEffect } from "react";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";

// 获取设备唯一标识
function getDeviceId() {
  let deviceId = localStorage.getItem("formuless-device-id");
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("formuless-device-id", deviceId);
  }
  return deviceId;
}

export default function Home() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isWatch, isMobile } = useDeviceDetect();

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
      const deviceId = getDeviceId();
      
      // 同时保存到 localStorage（降级方案）
      localStorage.setItem("formuless-content", content);
      
      // 保存到服务器
      fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": deviceId,
        },
        body: JSON.stringify({ content }),
      }).catch(() => {
        // 静默失败，已有 localStorage 兜底
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [content, isLoading]);

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

  // 手机端: 编辑模式
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <Editor content={content} onChange={setContent} />
      </div>
    );
  }

  // 桌面端: 左右分栏
  return (
    <div className="flex h-screen">
      <div className="w-1/2 border-r">
        <Editor content={content} onChange={setContent} />
      </div>
      <div className="w-1/2 overflow-auto bg-gray-50">
        <Preview content={content} />
      </div>
    </div>
  );
}
