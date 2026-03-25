import { useEffect, RefObject } from "react";

/**
 * 点击外部区域 Hook
 *
 * 检测点击事件是否发生在指定元素外部，常用于关闭下拉菜单、弹窗等
 *
 * @param ref 目标元素的 ref
 * @param handler 点击外部时的回调函数
 *
 * @example
 * ```typescript
 * const ref = useRef<HTMLDivElement>(null);
 *
 * useClickOutside(ref, () => {
 *   setIsOpen(false); // 点击外部关闭弹窗
 * });
 *
 * return <div ref={ref}>弹窗内容</div>;
 * ```
 */
const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;

      // 如果点击的是元素内部，不触发回调
      if (!element || element.contains(event.target as Node)) {
        return;
      }

      // 点击外部，触发回调
      handler(event);
    };

    // 监听鼠标和触摸事件
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
