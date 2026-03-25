import { useEffect, useRef, useState } from "react";

/**
 * 节流 Hook - 值版本
 *
 * 在指定时间内，无论触发多少次，只会在时间间隔内执行一次
 *
 * @param value 需要节流的值
 * @param delay 节流延迟时间（毫秒）
 * @returns 节流后的值
 *
 * @example
 * ```typescript
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 200);
 *
 * useEffect(() => {
 *   const handleScroll = () => setScrollY(window.scrollY);
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, []);
 * ```
 */
export const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecutedRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateValue = () => {
      lastExecutedRef.current = Date.now();
      setThrottledValue(value);
    };

    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutedRef.current;

    if (timeSinceLastExecution >= delay) {
      // 如果距离上次执行已经超过 delay，立即执行
      updateValue();
    } else {
      // 否则设置定时器，在剩余时间后执行
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(
        updateValue,
        delay - timeSinceLastExecution
      );
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return throttledValue;
};

/**
 * 节流 Hook - 函数版本
 *
 * 返回一个节流后的函数，在指定时间内只会执行一次
 *
 * @param fn 需要节流的函数
 * @param delay 节流延迟时间（毫秒）
 * @returns 节流后的函数
 *
 * @example
 * ```typescript
 * const handleScroll = useThrottleFn(() => {
 *   console.log('滚动位置:', window.scrollY);
 * }, 200);
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, [handleScroll]);
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottleFn = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T => {
  const lastExecutedRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutedRef.current;

    if (timeSinceLastExecution >= delay) {
      // 如果距离上次执行已经超过 delay，立即执行
      lastExecutedRef.current = now;
      fn(...args);
    } else {
      // 否则设置定时器，在剩余时间后执行
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastExecutedRef.current = Date.now();
        fn(...args);
      }, delay - timeSinceLastExecution);
    }
  }) as T;
};
