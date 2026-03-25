import { useState, useCallback } from "react";

/**
 * useCopyToClipboard 返回值
 */
export interface UseCopyToClipboardResult {
  /** 复制的内容 */
  copiedText: string | null;
  /** 复制函数 */
  copy: (text: string) => Promise<boolean>;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 复制到剪贴板 Hook
 *
 * 提供便捷的复制功能，自动处理兼容性和错误
 *
 * @returns 包含复制状态和操作方法的对象
 *
 * @example
 * ```typescript
 * const { copiedText, copy } = useCopyToClipboard();
 *
 * const handleCopy = async () => {
 *   const success = await copy('要复制的文本');
 *   if (success) {
 *     message.success('复制成功！');
 *   } else {
 *     message.error('复制失败！');
 *   }
 * };
 * ```
 */
export const useCopyToClipboard = (): UseCopyToClipboardResult => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      // 降级方案：使用 document.execCommand
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          setCopiedText(text);
          return true;
        }
        return false;
      } catch (error) {
        console.error("复制失败:", error);
        return false;
      }
    }

    // 现代浏览器使用 Clipboard API
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.error("复制失败:", error);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setCopiedText(null);
  }, []);

  return {
    copiedText,
    copy,
    reset
  };
};
