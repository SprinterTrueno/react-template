import { useState, useEffect } from "react";

/**
 * 窗口尺寸接口
 */
export interface WindowSize {
  width: number;
  height: number;
}

/**
 * 窗口尺寸 Hook
 *
 * 实时获取窗口的宽度和高度，自动响应窗口大小变化
 *
 * @returns 包含 width 和 height 的对象
 *
 * @example
 * ```typescript
 * const { width, height } = useWindowSize();
 *
 * if (width < 768) {
 *   // 移动端布局
 * } else {
 *   // 桌面端布局
 * }
 * ```
 */
const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // 监听窗口大小变化
    window.addEventListener("resize", handleResize);

    // 初始化时获取一次
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
