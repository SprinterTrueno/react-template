import request from "@/utils/request";

/**
 * 商品信息
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  categoryId: string;
  status: "on_sale" | "off_sale" | "sold_out";
  createdAt: string;
  updatedAt: string;
}

/**
 * 商品列表查询参数
 */
export interface ProductListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sortBy?: "price" | "sales" | "createdAt";
  sortOrder?: "asc" | "desc";
}

/**
 * 商品列表响应
 */
export interface ProductListResponse {
  list: Product[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 创建/更新商品参数
 */
export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  categoryId: string;
  status: "on_sale" | "off_sale";
}

/**
 * 商品相关 API
 */
export const productApi = {
  /**
   * 获取商品列表
   */
  getProductList: (params?: ProductListParams) => {
    return request.get<ProductListResponse>("/api/products", { params });
  },

  /**
   * 获取商品详情
   */
  getProductDetail: (productId: string) => {
    return request.get<Product>(`/api/products/${productId}`);
  },

  /**
   * 创建商品
   */
  createProduct: (data: ProductFormData) => {
    return request.post<Product>("/api/products", data);
  },

  /**
   * 更新商品
   */
  updateProduct: (productId: string, data: Partial<ProductFormData>) => {
    return request.put<Product>(`/api/products/${productId}`, data);
  },

  /**
   * 删除商品
   */
  deleteProduct: (productId: string) => {
    return request.delete(`/api/products/${productId}`);
  },

  /**
   * 批量上架
   */
  batchOnSale: (productIds: string[]) => {
    return request.post("/api/products/batch-on-sale", { productIds });
  },

  /**
   * 批量下架
   */
  batchOffSale: (productIds: string[]) => {
    return request.post("/api/products/batch-off-sale", { productIds });
  }
};
