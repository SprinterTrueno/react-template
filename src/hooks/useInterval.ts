import { useEffect, useRef } from "react";

/**
 * 安全的定时器 Hook
 *
 * 自动管理定时器的创建和清理，避免内存泄漏
 *
 * @param callback 定时器回调函数
 * @param delay 延迟时间（毫秒），null 表示暂停定时器
 *
 * @example
 * ```typescript
 * const [count, setCount] = useState(0);
 * const [isRunning, setIsRunning] = useState(true);
 *
 * useInterval(() => {
 *   setCount(count + 1);
 * }, isRunning ? 1000 : null);
 * ```
 */
const useInterval = (callback: () => void, delay: number | null): void => {
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

    const id = setInterval(tick, delay);

    return () => {
      clearInterval(id);
    };
  }, [delay]);
};

export default useInterval;
