import request from "@/utils/request";

/**
 * 用户信息接口参数
 */
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

/**
 * 更新用户信息参数
 */
export interface UpdateUserParams {
  username?: string;
  email?: string;
  avatar?: string;
}

/**
 * 用户列表查询参数
 */
export interface UserListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  role?: string;
}

/**
 * 用户列表响应
 */
export interface UserListResponse {
  list: UserInfo[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 用户相关 API
 */
export const userApi = {
  /**
   * 获取用户信息
   */
  getUserInfo: (userId: string) => {
    return request.get<UserInfo>(`/api/users/${userId}`);
  },

  /**
   * 更新用户信息
   */
  updateUserInfo: (userId: string, data: UpdateUserParams) => {
    return request.put<UserInfo>(`/api/users/${userId}`, data);
  },

  /**
   * 获取用户列表
   */
  getUserList: (params?: UserListParams) => {
    return request.get<UserListResponse>("/api/users", { params });
  },

  /**
   * 删除用户
   */
  deleteUser: (userId: string) => {
    return request.delete(`/api/users/${userId}`);
  },

  /**
   * 批量删除用户
   */
  batchDeleteUsers: (userIds: string[]) => {
    return request.post("/api/users/batch-delete", { userIds });
  }
};
