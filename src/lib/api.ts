const API_URL = 'https://functions.poehali.dev/6de029af-28a1-47e9-a9d2-1f91dadae78b';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  return res.json();
}

export const api = {
  getCategories: () => request('/categories'),
  getProducts: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/products${qs}`);
  },
  getProduct: (id: number) => request(`/products/${id}`),
  createProduct: (data: object) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: number, data: object) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getSellers: () => request('/sellers'),
  getSeller: (id: number) => request(`/sellers/${id}`),

  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: object) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  createOrder: (data: object) =>
    request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getUserOrders: (userId: number) =>
    request(`/orders?user_id=${userId}`),

  addReview: (data: object) =>
    request('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  admin: {
    getStats: () => request('/admin/stats'),
    getProducts: () => request('/admin/products'),
    getOrders: () => request('/admin/orders'),
    updateOrderStatus: (id: number, status: string) =>
      request(`/admin/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    getUsers: () => request('/admin/users'),
    getSellers: () => request('/admin/sellers'),
  },
};
