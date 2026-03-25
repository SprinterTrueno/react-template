import { useEffect, useRef } from "react";

/**
 * 延迟执行 Hook
 *
 * 在指定延迟后执行回调函数，自动清理定时器
 *
 * @param callback 延迟执行的回调函数
 * @param delay 延迟时间（毫秒），null 表示取消定时器
 *
 * @example
 * ```typescript
 * const [showTip, setShowTip] = useState(true);
 *
 * useTimeout(() => {
 *   setShowTip(false); // 3秒后自动关闭提示
 * }, 3000);
 * ```
 */
const useTimeout = (callback: () => void, delay: number | null): void => {
  const savedCallback = useRef<() => void>(callback);

  // 保存最新的回调函数
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 设置定时器
  useEffect(() => {
    if (delay === null) {
      return undefined;
    }

    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    const id = setTimeout(tick, delay);

    return () => {
      clearTimeout(id);
    };
  }, [delay]);
};

export default useTimeout;
