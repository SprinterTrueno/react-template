import { useState, useCallback } from "react";

/**
 * 请求状态
 */
export interface RequestState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

/**
 * useRequest 返回值
 */
export interface UseRequestResult<
  T,
  P extends unknown[]
> extends RequestState<T> {
  run: (...args: P) => Promise<T>;
  reset: () => void;
}

/**
 * useRequest 配置
 */
export interface UseRequestOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

/**
 * 通用请求 Hook
 *
 * @example
 * ```TypeScript
 * const { loading, data, error, run } = useRequest(userApi.login);
 *
 * const handleLogin = async () => {
 *   try {
 *     const result = await run({ username, password });
 *     message.success('登录成功');
 *   } catch (error) {
 *     message.error('登录失败');
 *   }
 * };
 * ```
 */
export const useRequest = <T, P extends unknown[] = unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  options?: UseRequestOptions<T>
): UseRequestResult<T, P> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const run = useCallback(
    async (...args: P): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const result = await requestFn(...args);
        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const requestError = err as Error;
        setError(requestError);
        options?.onError?.(requestError);
        throw requestError;
      } finally {
        setLoading(false);
        options?.onFinally?.();
      }
    },
    [requestFn, options]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    run,
    reset
  };
};
