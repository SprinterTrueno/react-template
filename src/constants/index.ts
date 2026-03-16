/**
 * API 基础地址
 */
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.example.com"
    : "http://localhost:3000";

/**
 * 请求超时时间（毫秒）
 */
export const REQUEST_TIMEOUT = 10000;
