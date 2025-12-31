import { message } from "antd";

/**
 * 统一响应数据格式
 */
export interface ResponseData<T = unknown> {
  code: number;
  data: T;
  message: string;
}

/**
 * 请求配置选项
 */
export interface RequestOptions extends RequestInit {
  timeout?: number;
  baseURL?: string;
  showError?: boolean;
  showSuccess?: boolean;
}

/**
 * 请求拦截器函数类型
 */
export type RequestInterceptor = (
  url: string,
  options: RequestOptions
) =>
  | Promise<{ url: string; options: RequestOptions }>
  | { url: string; options: RequestOptions };

/**
 * 响应拦截器函数类型
 */
export type ResponseInterceptor = <T>(
  response: ResponseData<T>
) => ResponseData<T> | Promise<ResponseData<T>>;

/**
 * 错误拦截器函数类型
 */
export type ErrorInterceptor = (error: Error) => void | Promise<void>;

/**
 * 请求工具类
 */
class Request {
  private baseURL: string = "";

  private timeout: number = 10000;

  private requestInterceptors: RequestInterceptor[] = [];

  private responseInterceptors: ResponseInterceptor[] = [];

  private errorInterceptors: ErrorInterceptor[] = [];

  /**
   * 设置基础 URL
   */
  setBaseURL(url: string) {
    this.baseURL = url;
    return this;
  }

  /**
   * 设置默认超时时间
   */
  setTimeout(timeout: number) {
    this.timeout = timeout;
    return this;
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
    return this;
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
    return this;
  }

  /**
   * 添加错误拦截器
   */
  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
    return this;
  }

  /**
   * 创建超时 Promise
   */
  // eslint-disable-next-line class-methods-use-this
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * 执行请求拦截器
   */
  private async executeRequestInterceptors(
    url: string,
    options: RequestOptions
  ): Promise<{ url: string; options: RequestOptions }> {
    let currentUrl = url;
    let currentOptions = options;

    // eslint-disable-next-line no-restricted-syntax
    for (const interceptor of this.requestInterceptors) {
      // eslint-disable-next-line no-await-in-loop
      const result = await interceptor(currentUrl, currentOptions);
      currentUrl = result.url;
      currentOptions = result.options;
    }

    return { url: currentUrl, options: currentOptions };
  }

  /**
   * 执行响应拦截器
   */
  private async executeResponseInterceptors<T>(
    response: ResponseData<T>
  ): Promise<ResponseData<T>> {
    let currentResponse = response;

    // eslint-disable-next-line no-restricted-syntax
    for (const interceptor of this.responseInterceptors) {
      // eslint-disable-next-line no-await-in-loop
      currentResponse = await interceptor(currentResponse);
    }

    return currentResponse;
  }

  /**
   * 执行错误拦截器
   */
  private async executeErrorInterceptors(error: Error): Promise<void> {
    // eslint-disable-next-line no-restricted-syntax
    for (const interceptor of this.errorInterceptors) {
      // eslint-disable-next-line no-await-in-loop
      await interceptor(error);
    }
  }

  /**
   * 核心请求方法
   */
  async request<T = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    try {
      // 合并配置
      const finalOptions: RequestOptions = {
        timeout: this.timeout,
        baseURL: this.baseURL,
        showError: true,
        showSuccess: false,
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        }
      };

      // 构建完整 URL
      let fullUrl = finalOptions.baseURL
        ? `${finalOptions.baseURL}${url}`
        : url;

      // 执行请求拦截器
      const interceptedRequest = await this.executeRequestInterceptors(
        fullUrl,
        finalOptions
      );
      fullUrl = interceptedRequest.url;
      const interceptedOptions = interceptedRequest.options;

      // 移除自定义属性
      const { timeout, baseURL, showError, showSuccess, ...fetchOptions } =
        interceptedOptions;

      // 发起请求（带超时）
      const fetchPromise = fetch(fullUrl, fetchOptions);
      const timeoutPromise = this.createTimeoutPromise(timeout || this.timeout);

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // 检查 HTTP 状态
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      // 解析响应
      const contentType = response.headers.get("content-type");
      let result: unknown;

      if (contentType?.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      // 智能判断响应格式
      // 1. 如果响应有 code 字段，说明是包装格式（如：{ code: 200, data: {...}, message: "success" }）
      // 2. 如果响应没有 code 字段，说明是直接格式（如：{ id: 1, name: "..." }）
      if (typeof result === "object" && result !== null && "code" in result) {
        // 包装格式：执行响应拦截器
        const responseData = result as ResponseData<T>;
        const interceptedResponse =
          await this.executeResponseInterceptors(responseData);

        // 业务逻辑判断
        if (interceptedResponse.code !== 200) {
          throw new Error(interceptedResponse.message || "Request failed");
        }

        // 显示成功消息
        if (showSuccess && interceptedResponse.message) {
          message.success(interceptedResponse.message);
        }

        return interceptedResponse.data;
      }
      // 直接格式：直接返回整个响应
      return result as T;
    } catch (error) {
      // 执行错误拦截器
      await this.executeErrorInterceptors(error as Error);

      // 显示错误消息
      if (options.showError !== false) {
        message.error((error as Error).message || "Request failed");
      }

      throw error;
    }
  }

  /**
   * GET 请求
   */
  get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    options?: RequestOptions
  ): Promise<T> {
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

    return this.request<T>(finalUrl, {
      ...options,
      method: "GET"
    });
  }

  /**
   * POST 请求
   */
  post<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * PUT 请求
   */
  put<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * DELETE 请求
   */
  delete<T = unknown>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "DELETE"
    });
  }

  /**
   * PATCH 请求
   */
  patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * 上传文件
   */
  upload<T = unknown>(
    url: string,
    formData: FormData,
    options?: RequestOptions
  ): Promise<T> {
    // 上传文件时不设置 Content-Type，让浏览器自动设置
    const { headers, ...restOptions } = options || {};
    const finalHeaders = { ...(headers || {}) } as Record<string, string>;
    delete finalHeaders["Content-Type"];

    return this.request<T>(url, {
      ...restOptions,
      method: "POST",
      headers: finalHeaders,
      body: formData
    });
  }

  /**
   * 下载文件
   */
  async download(
    url: string,
    filename?: string,
    options?: RequestOptions
  ): Promise<void> {
    try {
      const response = await fetch(url, {
        ...options,
        method: options?.method || "GET"
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // 从响应头或参数获取文件名
      link.download =
        filename || this.getFilenameFromResponse(response) || "download";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      message.error((error as Error).message || "Download failed");
      throw error;
    }
  }

  /**
   * 从响应头获取文件名
   */
  // eslint-disable-next-line class-methods-use-this
  private getFilenameFromResponse(response: Response): string | null {
    const disposition = response.headers.get("content-disposition");
    if (disposition) {
      const filenameMatch = disposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      );
      if (filenameMatch && filenameMatch[1]) {
        return filenameMatch[1].replace(/['"]/g, "");
      }
    }
    return null;
  }
}

// 创建默认实例
const request = new Request();

// 添加默认请求拦截器：添加 token
request.addRequestInterceptor((url, options) => {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      url,
      options: {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      }
    };
  }
  return { url, options };
});

// 添加默认响应拦截器：处理特定业务逻辑
request.addResponseInterceptor((response) => {
  // 可以在这里添加业务逻辑，比如统一处理某些错误码
  return response;
});

// 添加默认错误拦截器：处理特定错误
request.addErrorInterceptor((error) => {
  // 处理特定错误，如 401 跳转登录等
  if (error.message.includes("401")) {
    // 可以在这里处理未授权逻辑
    console.error("Unauthorized access");
  }
});

export { Request };
export default request;
