// API helpers for user management
// Assumes an axios instance is exported from UI/src/request.js as default

import request from '../request'

// Mock 模式开关：设置为 false 使用真实后端 API
const USE_MOCK = false  // 已改为使用真实后端

/**
 * Get paginated user list
 * @param {Object} query - { pageNum, pageSize, keyword }
 */
export function listUser(query) {
  return request({
    url: '/api/system/user/list',
    method: 'get',
    params: query
  })
}

/**
 * Get user details by id
 * @param {Number|String} id
 */
export function getUser(id) {
  return request({
    url: `/api/system/user/${id}`,
    method: 'get'
  })
}

/**
 * Update user
 * @param {Object} data - JSON body containing fields to update
 */
export function updateUser(data) {
  return request({
    url: '/api/system/user/update',
    method: 'put',
    data
  })
}

/**
 * Reset user baseline
 * @param {Number|String} userId
 */
export function resetUserBaseline(userId) {
  return request({
    url: `/api/system/user/reset-baseline/${userId}`,
    method: 'put'
  })
}

/**
 * Get current user profile
 * Mock 模式：从 localStorage 读取用户信息
 * 真实模式：调用后端 API
 */
export async function getUserProfile() {
  if (USE_MOCK) {
    // Mock 实现：从 localStorage 读取
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('auth_user') || '{}')
        resolve({
          code: 200,
          message: 'success',
          data: user
        })
      }, 100) // 模拟网络延迟
    })
  }

  // 真实 API 调用
  try {
    return await request({
      url: '/api/system/user/profile',
      method: 'get'
    })
  } catch (err) {
    const status = err && err.response && err.response.status
    if (status === 400 || status === 405) {
      // try POST as a fallback
      return request({
        url: '/api/system/user/profile',
        method: 'post'
      })
    }
    throw err
  }
}

/**
 * Update current user profile
 * Mock 模式：更新 localStorage 中的用户信息
 * 真实模式：调用后端 API
 * @param {Object} data
 */
export function updateUserProfile(data) {
  if (USE_MOCK) {
    // Mock 实现：更新 localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = JSON.parse(localStorage.getItem('auth_user') || '{}')
        const updated = { ...current, ...data }
        localStorage.setItem('auth_user', JSON.stringify(updated))

        console.log('[Mock API] 用户信息已更新:', updated)

        resolve({
          code: 200,
          message: '更新成功'
        })
      }, 100) // 模拟网络延迟
    })
  }

  // 真实 API 调用
  return request({
    url: '/api/system/user/profile',
    method: 'post',
    data
  })
}

/**
 * Update user password
 * Mock 模式：模拟密码修改成功
 * 真实模式：调用后端 API
 * @param {String} oldPassword
 * @param {String} newPassword
 */
export function updateUserPwd(oldPassword, newPassword) {
  if (USE_MOCK) {
    // Mock 实现：模拟密码修改
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 简单验证：旧密码不为空
        if (!oldPassword || oldPassword.length < 1) {
          reject({
            response: {
              data: { message: '旧密码不能为空' }
            }
          })
          return
        }

        // 验证新密码长度
        if (!newPassword || newPassword.length < 6) {
          reject({
            response: {
              data: { message: '新密码长度至少6位' }
            }
          })
          return
        }

        console.log('[Mock API] 密码修改成功')

        resolve({
          code: 200,
          message: '密码修改成功'
        })
      }, 100)
    })
  }

  // 真实 API 调用
  return request({
    url: '/api/system/user/profile/password',
    method: 'post',
    data: { oldPassword, newPassword }
  })
}

export default {
  listUser,
  getUser,
  updateUser,
  resetUserBaseline,
  getUserProfile,
  updateUserProfile,
  updateUserPwd
}
