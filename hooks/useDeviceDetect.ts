"use client";

import { useState, useEffect } from "react";

export function useDeviceDetect() {
  const [isWatch, setIsWatch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const width = window.innerWidth;

    // Apple Watch 检测
    setIsWatch(width <= 200 || userAgent.includes("watch"));

    // 手机检测
    setIsMobile(
      width <= 768 &&
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      )
    );
  }, []);

  return { isWatch, isMobile };
}
