// Mock数据服务
export const mockApi = {
  // 模拟登录
  login: (credentials: { email: string; password: string }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            user: {
              id: '1',
              email: credentials.email,
              name: '测试用户',
              avatar: 'https://via.placeholder.com/40x40',
              role: 'merchant',
              tenantId: 'tenant-1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            token: 'mock-jwt-token-' + Date.now()
          }
        })
      }, 1000)
    })
  },

  // 模拟注册
  register: (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            user: {
              id: '1',
              email: data.email,
              name: data.name,
              avatar: 'https://via.placeholder.com/40x40',
              role: 'merchant',
              tenantId: 'tenant-1',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            token: 'mock-jwt-token-' + Date.now()
          }
        })
      }, 1000)
    })
  },

  // 模拟获取当前用户
  getCurrentUser: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            id: '1',
            email: 'test@example.com',
            name: '测试用户',
            avatar: 'https://via.placeholder.com/40x40',
            role: 'merchant',
            tenantId: 'tenant-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        })
      }, 500)
    })
  },

  // 模拟登出
  logout: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: null })
      }, 500)
    })
  }
}
