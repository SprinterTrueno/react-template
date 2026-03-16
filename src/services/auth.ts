import request from "@/utils/request";

/**
 * 登录参数
 */
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string;
  refreshToken: string;
  userInfo: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

/**
 * 注册参数
 */
export interface RegisterParams {
  username: string;
  password: string;
  email: string;
  captcha: string;
}

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 用户登录
   */
  login: (data: LoginParams) => {
    return request.post<LoginResponse>("/api/auth/login", data);
  },

  /**
   * 用户注册
   */
  register: (data: RegisterParams) => {
    return request.post<LoginResponse>("/api/auth/register", data);
  },

  /**
   * 用户登出
   */
  logout: () => {
    return request.post("/api/auth/logout");
  },

  /**
   * 刷新 token
   */
  refreshToken: (refreshToken: string) => {
    return request.post<{ token: string; refreshToken: string }>(
      "/api/auth/refresh",
      { refreshToken }
    );
  },

  /**
   * 获取验证码
   */
  getCaptcha: () => {
    return request.get<{ captcha: string; key: string }>("/api/auth/captcha");
  },

  /**
   * 重置密码
   */
  resetPassword: (data: {
    email: string;
    code: string;
    newPassword: string;
  }) => {
    return request.post("/api/auth/reset-password", data);
  }
};
