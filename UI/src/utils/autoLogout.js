// ========================================
// 自动登出插件 - 10分钟无操作自动退出登录
// ========================================

export function setupAutoLogout() {
  const TIMEOUT_DURATION = 10 * 60 * 1000 // 10分钟（毫秒）
  let timeoutId = null
  let lastActivityTime = Date.now()

  // 需要监听的用户活动事件
  const activityEvents = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click'
  ]

  // 重置计时器
  function resetTimer() {
    lastActivityTime = Date.now()

    // 清除旧的计时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 设置新的计时器
    timeoutId = setTimeout(() => {
      handleTimeout()
    }, TIMEOUT_DURATION)

    console.log('🕒 活动检测：计时器已重置，将在10分钟后自动登出')
  }

  // 处理超时
  function handleTimeout() {
    console.log('⏰ 检测到10分钟无操作，自动登出...')

    // 显示提示
    if (confirm('您已经10分钟没有操作，系统将自动退出登录。\n\n点击"确定"重新登录，点击"取消"继续使用。')) {
      logout()
    } else {
      // 用户选择继续使用，重置计时器
      resetTimer()
    }
  }

  // 执行登出
  function logout() {
    console.log('🚪 自动登出中...')

    // 清除所有登录信息
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    sessionStorage.clear()

    // 清除计时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 移除事件监听
    cleanup()

    // 提示用户
    alert('您已退出登录，请重新登录')

    // 跳转到登录页
    window.location.href = '/login'
  }

  // 添加事件监听
  function addEventListeners() {
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer, true)
    })
    console.log('✅ 自动登出功能已启用（10分钟无操作后自动退出）')
  }

  // 清理事件监听
  function cleanup() {
    activityEvents.forEach(event => {
      window.removeEventListener(event, resetTimer, true)
    })
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  // 检查是否已登录
  function isLoggedIn() {
    return !!localStorage.getItem('auth_token')
  }

  // 初始化
  function init() {
    // 只有在已登录状态下才启用自动登出
    if (isLoggedIn()) {
      addEventListeners()
      resetTimer()
    } else {
      console.log('ℹ️ 未登录，自动登出功能未启用')
    }
  }

  // 提供外部接口
  return {
    init,
    cleanup,
    resetTimer,
    logout
  }
}

// 导出单例
let autoLogoutInstance = null

export function initAutoLogout() {
  if (!autoLogoutInstance) {
    autoLogoutInstance = setupAutoLogout()
    autoLogoutInstance.init()
  }
  return autoLogoutInstance
}

export function destroyAutoLogout() {
  if (autoLogoutInstance) {
    autoLogoutInstance.cleanup()
    autoLogoutInstance = null
  }
}

