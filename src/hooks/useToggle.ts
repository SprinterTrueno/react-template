import { useState, useCallback } from "react";

/**
 * useToggle 返回值
 */
export interface UseToggleResult {
  /** 当前布尔值 */
  value: boolean;
  /** 切换布尔值 */
  toggle: () => void;
  /** 设置为 true */
  setTrue: () => void;
  /** 设置为 false */
  setFalse: () => void;
  /** 直接设置值 */
  setValue: (value: boolean) => void;
}

/**
 * 布尔值切换 Hook
 *
 * 提供更便捷的布尔值状态管理，比 useState 更简洁
 *
 * @param initialValue 初始值，默认 false
 * @returns 包含当前值和操作方法的对象
 *
 * @example
 * ```typescript
 * const { value, toggle, setTrue, setFalse } = useToggle();
 *
 * // 切换
 * toggle();
 *
 * // 设置为 true
 * setTrue();
 *
 * // 设置为 false
 * setFalse();
 * ```
 */
export const useToggle = (initialValue = false): UseToggleResult => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue
  };
};
