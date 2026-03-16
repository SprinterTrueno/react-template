import { useState, useEffect, useRef } from "react";

/**
 * 简单的内存缓存
 */
const cache = new Map<string, { data: unknown; timestamp: number }>();

/**
 * 缓存订阅者（用于自动刷新）
 * key: cacheKey, value: Set of refresh functions
 */
const cacheSubscribers = new Map<string, Set<() => void>>();

/**
 * 使缓存失效并触发所有订阅者重新获取数据
 * 类似 React Query 的 invalidateQueries
 */
const invalidateQueriesInternal = (cacheKey: string) => {
  // 1. 清除缓存
  cache.delete(cacheKey);

  // 2. 通知所有订阅者刷新
  const subscribers = cacheSubscribers.get(cacheKey);
  if (subscribers) {
    subscribers.forEach((refresh) => {
      refresh();
    });
  }
};

/**
 * 请求状态
 */
export interface RequestState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

/**
 * useRequestPro 返回值
 */
export interface UseRequestProResult<
  T,
  P extends unknown[]
> extends RequestState<T> {
  run: (...args: P) => Promise<T>;
  reset: () => void;
  mutate: (newData: T) => void;
}

/**
 * useRequestPro 配置
 */
export interface UseRequestProOptions<T, P extends unknown[] = unknown[]> {
  /** 成功回调 */
  onSuccess?: (data: T) => void;
  /** 失败回调 */
  onError?: (error: Error) => void;
  /** 完成回调 */
  onFinally?: () => void;
  /** 重试回调 */
  onRetry?: (attempt: number, error: Error) => void;

  /** 是否启用缓存，默认 false */
  enableCache?: boolean;
  /** 缓存 key，用于标识缓存 */
  cacheKey?: string;
  /** 缓存时间（毫秒），默认 5 分钟 */
  cacheTime?: number;

  /** 是否启用自动重试，默认 false */
  enableRetry?: boolean;
  /** 重试次数，默认 3 次 */
  retryCount?: number;
  /** 重试延迟（毫秒），默认 1000ms */
  retryDelay?: number;

  /** 是否在窗口聚焦时自动刷新，默认 false */
  refetchOnWindowFocus?: boolean;

  /** 是否在组件挂载时自动执行，默认 false */
  manual?: boolean;
  /** 自动执行时的默认参数 */
  defaultParams?: P;

  /** 成功后自动失效的缓存 key 列表（类似 React Query 的 invalidateQueries） */
  invalidateKeys?: string[];
}

/**
 * 超级增强版请求 Hook
 *
 * 功能：
 * 1. 基础请求管理（loading、data、error）
 * 2. 缓存支持
 * 3. 自动重试
 * 4. 窗口聚焦自动刷新
 * 5. Mutation 管理（手动更新数据）
 *
 * @example
 * ```typescript
 * // 基础使用
 * const { loading, data, run } = useRequestPro(fetchUser);
 *
 * // 启用缓存
 * const { data, run } = useRequestPro(fetchUser, {
 *   enableCache: true,
 *   cacheKey: 'user-123'
 * });
 *
 * // 启用自动重试
 * const { data, run } = useRequestPro(fetchUser, {
 *   enableRetry: true,
 *   retryCount: 3
 * });
 *
 * // 窗口聚焦自动刷新
 * const { data, run } = useRequestPro(fetchUser, {
 *   refetchOnWindowFocus: true
 * });
 *
 * // Mutation（手动更新数据）
 * const { data, mutate } = useRequestPro(fetchUser);
 * mutate({ ...data, name: '新名字' }); // 立即更新 UI
 * ```
 */
export const useRequestPro = <T, P extends unknown[] = unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  options?: UseRequestProOptions<T, P>
): UseRequestProResult<T, P> => {
  const {
    onSuccess,
    onError,
    onFinally,
    onRetry,
    enableCache = false,
    cacheKey,
    cacheTime = 5 * 60 * 1000,
    enableRetry = false,
    retryCount = 3,
    retryDelay = 1000,
    refetchOnWindowFocus = false,
    manual = true,
    defaultParams,
    invalidateKeys = []
  } = options || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  // 保存最后一次请求的参数，用于重试和刷新
  const lastParamsRef = useRef<P | undefined>(undefined);

  // 组件挂载时，尝试从缓存读取
  useEffect(() => {
    if (enableCache && cacheKey) {
      const cached = cache.get(cacheKey);
      if (cached) {
        const now = Date.now();
        const isExpired = now - cached.timestamp > cacheTime;

        if (!isExpired) {
          setData(cached.data as T);
        } else {
          cache.delete(cacheKey);
        }
      }
    }
  }, [enableCache, cacheKey, cacheTime]);

  // run 函数的引用
  const runRef = useRef<((...args: P) => Promise<T>) | null>(null);

  // 窗口聚焦自动刷新
  useEffect(() => {
    if (!refetchOnWindowFocus) return undefined;

    const handleFocus = () => {
      // 如果有上次的参数，使用上次的参数重新请求
      if (lastParamsRef.current && runRef.current) {
        runRef.current(...lastParamsRef.current);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetchOnWindowFocus]);

  const run = async (...args: P): Promise<T> => {
    // 保存参数，用于重试和刷新
    lastParamsRef.current = args;

    // 如果启用缓存且有缓存 key，先检查缓存
    if (enableCache && cacheKey) {
      const cached = cache.get(cacheKey);
      if (cached) {
        const now = Date.now();
        const isExpired = now - cached.timestamp > cacheTime;

        if (!isExpired) {
          return cached.data as T;
        }
      }
    }

    setLoading(true);
    setError(null);

    try {
      // 带重试的请求逻辑
      let lastError: Error | null = null;
      const maxAttempts = enableRetry ? retryCount + 1 : 1;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const result = await requestFn(...args);
          setData(result);

          // 存入缓存
          if (enableCache && cacheKey) {
            cache.set(cacheKey, {
              data: result,
              timestamp: Date.now()
            });
          }

          onSuccess?.(result);

          // 自动失效指定的缓存 key
          if (invalidateKeys.length > 0) {
            invalidateKeys.forEach((key) => {
              invalidateQueriesInternal(key);
            });
          }

          return result;
        } catch (err) {
          lastError = err as Error;

          // 如果还有重试次数，等待后重试
          if (attempt < maxAttempts - 1) {
            // 调用重试回调
            onRetry?.(attempt + 1, lastError);

            // eslint-disable-next-line no-await-in-loop
            await new Promise<void>((resolve) => {
              setTimeout(resolve, retryDelay);
            });
          }
        }
      }

      throw lastError;
    } catch (err) {
      const requestError = err as Error;
      setError(requestError);
      onError?.(requestError);
      throw requestError;
    } finally {
      setLoading(false);
      onFinally?.();
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);

    if (cacheKey) {
      cache.delete(cacheKey);
    }
  };

  // Mutation：手动更新数据
  const mutate = (newData: T) => {
    setData(newData);

    // 更新缓存
    if (enableCache && cacheKey) {
      cache.set(cacheKey, {
        data: newData,
        timestamp: Date.now()
      });
    }
  };

  // 保存 run 函数的引用
  runRef.current = run;

  // 订阅缓存失效事件
  useEffect(() => {
    if (!cacheKey) return undefined;

    // 创建刷新函数
    const refresh = () => {
      if (lastParamsRef.current && runRef.current) {
        runRef.current(...lastParamsRef.current);
      }
    };

    // 订阅
    if (!cacheSubscribers.has(cacheKey)) {
      cacheSubscribers.set(cacheKey, new Set());
    }
    const subscriberSet = cacheSubscribers.get(cacheKey);
    if (subscriberSet) {
      subscriberSet.add(refresh);
    }

    // 取消订阅
    return () => {
      const currentSubscribers = cacheSubscribers.get(cacheKey);
      if (currentSubscribers) {
        currentSubscribers.delete(refresh);
        if (currentSubscribers.size === 0) {
          cacheSubscribers.delete(cacheKey);
        }
      }
    };
  }, [cacheKey]);

  // 自动执行
  useEffect(() => {
    if (!manual && runRef.current) {
      if (defaultParams) {
        runRef.current(...defaultParams);
      } else {
        // 如果没有提供 defaultParams，使用空参数调用
        runRef.current(...([] as unknown as P));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manual]);

  return {
    loading,
    error,
    data,
    run,
    reset,
    mutate
  };
};

/**
 * 使缓存失效并触发所有订阅者重新获取数据
 * 类似 React Query 的 invalidateQueries
 *
 * @example
 * ```typescript
 * // 获取用户列表
 * const { data: users } = useRequestPro(getUserList, {
 *   manual: false,
 *   cacheKey: 'users'
 * });
 *
 * // 创建用户后，使缓存失效
 * const { run: createUser } = useRequestPro(mockCreateUser, {
 *   onSuccess: () => {
 *     invalidateQueries('users');  // 自动触发所有使用 'users' 的组件刷新
 *   }
 * });
 * ```
 */
export const invalidateQueries = (cacheKey: string) => {
  invalidateQueriesInternal(cacheKey);
};

/**
 * 清除所有缓存
 */
export const clearAllCache = () => {
  cache.clear();
};

/**
 * 清除指定缓存
 */
export const clearCache = (cacheKey: string) => {
  cache.delete(cacheKey);
};
