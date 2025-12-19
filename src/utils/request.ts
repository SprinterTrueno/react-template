import { message } from "antd";
/**
 * 统一响应数据格式
 */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

/**
 * 请求配置
 */
export interface FetchOptions extends RequestInit {
  showError?: boolean;
  showSuccess?: boolean;
}

/**
 * 请求函数接口
 */
interface RequestFunction {
  <T = unknown>(url: string, options?: FetchOptions): Promise<T>;
  get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    options?: FetchOptions
  ): Promise<T>;
  post<T = unknown>(
    url: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<T>;
  put<T = unknown>(
    url: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<T>;
  delete<T = unknown>(url: string, options?: FetchOptions): Promise<T>;
  patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: FetchOptions
  ): Promise<T>;
}

/**
 * 基础请求函数
 */
async function baseRequest<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    // 自动添加 token
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>)
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // 发起请求
    const response = await fetch(url, {
      ...options,
      headers
    });

    // 检查 HTTP 状态
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // 解析响应
    const result = await response.json();

    // 智能判断响应格式
    // 1. 如果响应有 code 字段，说明是包装格式（如：{ code: 200, data: {...}, message: "success" }）
    // 2. 如果响应没有 code 字段，说明是直接格式（如：{ id: 1, name: "..." }）
    if (typeof result === "object" && result !== null && "code" in result) {
      // 包装格式：检查业务状态码
      const wrappedResult = result as ApiResponse<T>;
      if (wrappedResult.code !== 200) {
        throw new Error(wrappedResult.message || "Request failed");
      }

      // 显示成功消息
      if (options.showSuccess && wrappedResult.message) {
        message.success(wrappedResult.message);
      }

      return wrappedResult.data;
    }
    // 直接格式：直接返回整个响应
    return result as T;
  } catch (error) {
    // 显示错误消息
    if (options.showError !== false) {
      message.error((error as Error).message || "Request failed");
    }
    throw error;
  }
}

/**
 * 创建 request 函数（可直接调用，也可调用方法）
 */
const request = baseRequest as RequestFunction;

/**
 * GET 请求
 */
request.get = <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  options?: FetchOptions
): Promise<T> => {
  // 构建查询字符串
  let finalUrl = url;
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();

    finalUrl = queryString ? `${url}?${queryString}` : url;
  }

  return baseRequest<T>(finalUrl, {
    ...options,
    method: "GET"
  });
};

/**
 * POST 请求
 */
request.post = <T = unknown>(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> => {
  return baseRequest<T>(url, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined
  });
};

/**
 * PUT 请求
 */
request.put = <T = unknown>(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> => {
  return baseRequest<T>(url, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined
  });
};

/**
 * DELETE 请求
 */
request.delete = <T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> => {
  return baseRequest<T>(url, {
    ...options,
    method: "DELETE"
  });
};

/**
 * PATCH 请求
 */
request.patch = <T = unknown>(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> => {
  return baseRequest<T>(url, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined
  });
};

export default request;
