<template>
  <div class="container">
    <div class="noise-overlay"></div>

    <div class="card">
      <div class="card-header">
        <h1>碳惠校园</h1>
        <p class="lead">MANAGEMENT CONSOLE</p>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="input-group">
          <label>管理员账号</label>
          <input
              v-model="account"
              placeholder="Username"
              autocomplete="off"
          />
        </div>

        <div class="input-group">
          <label>密码</label>
          <input
              v-model="password"
              type="password"
              placeholder="Password"
              autocomplete="new-password"
          />
        </div>

        <div class="actions">
          <label class="checkbox-container">
            <input type="checkbox" v-model="remember" />
            <span class="checkmark"></span>
            <span class="text">记住我</span>
          </label>
          <a href="#" class="forgot-link" @click.prevent="forgot">忘记密码?</a>
        </div>

        <button type="submit" class="btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '登录中...' : '登 录' }}
        </button>

        <transition name="fade">
          <p class="error" v-if="error">
            <i class="icon-warn">!</i> {{ error }}
          </p>
        </transition>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const account = ref('')
    const password = ref('')
    const remember = ref(false)
    const loading = ref(false)
    const error = ref('')

    const validate = () => {
      console.log('Login.validate: account=', account.value, 'passwordLen=', (password.value || '').length)
      if (!account.value) { error.value = '请输入管理员账号'; return false }
      if (!password.value) { error.value = '请输入密码'; return false }
      error.value = ''
      return true
    }

    const onSubmit = async () => {
      console.log('Login.onSubmit invoked')
      if (!validate()) return
      loading.value = true
      error.value = ''

      try {
        console.log('Login.fetch ->', { account: account.value, passwordLen: (password.value || '').length })
        const resp = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: account.value, password: password.value })
        })

        if (!resp.ok) {
          const txt = await resp.text();
          let message = '登录失败';
          try {
            const json = JSON.parse(txt);
            if(json.message) message = json.message;
          } catch(e) {}
          console.log('Login.fetch non-ok response:', resp.status, message)
          throw new Error(message)
        }

        const data = await resp.json()
        console.log('Login success, received data keys:', Object.keys(data || {}))

        const storage = remember.value ? localStorage : sessionStorage
        storage.setItem('auth_token', data.token)
        storage.setItem('auth_user', JSON.stringify(data.user))

        // 清理另一个存储，防止冲突
        const otherStorage = remember.value ? sessionStorage : localStorage
        otherStorage.removeItem('auth_token')
        otherStorage.removeItem('auth_user')

        if (remember.value) {
          localStorage.setItem('remember_account', account.value)
        } else {
          localStorage.removeItem('remember_account')
        }

        // 登录成功 - 刷新页面
        console.log('登录成功，刷新页面...')
        window.location.reload()

      } catch (e) {
        console.error('Login.onSubmit error', e)
        error.value = e.message || '登录请求异常'
      } finally {
        loading.value = false
      }
    }

    const forgot = () => { alert('请联系管理员重置密码') }

    const remembered = localStorage.getItem('remember_account')
    if (remembered) { account.value = remembered; remember.value = true }

    return { account, password, remember, loading, error, onSubmit, forgot }
  }
}
</script>

<style scoped>
/* 引入一点复古字体，没有也没关系，会回退到 sans-serif */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500&display=swap');

:root {
  --primary-gold: #d4af37; /* 复古金 */
  --glass-bg: rgba(20, 25, 40, 0.65); /* 深色半透明背景 */
  --glass-border: rgba(255, 255, 255, 0.15);
  --text-white: #f0f0f0;
  --text-gray: #9ca3af;
}

/* 1. 容器：保留你的背景图 */
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 关键修改：使用你的本地图片 */
  background: url('../assets/login-bg.png') no-repeat center center;
  background-size: cover;

  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* 2. 噪点层：给背景图加一层“老电影”滤镜 */
.noise-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.08; /* 噪点浓度，可调 */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* 3. 卡片：磨砂玻璃核心 */
.card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  padding: 45px 40px;
  border-radius: 16px;

  /* 磨砂效果关键代码 */
  background: var(--glass-bg); /* 深色底，让字看清楚 */
  backdrop-filter: blur(12px); /* 背景模糊 */
  -webkit-backdrop-filter: blur(12px);

  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); /* 深邃阴影 */
  transition: transform 0.3s ease;
}

/* 标题区 */
.card-header {
  text-align: center;
  margin-bottom: 35px;
}

h1 {
  font-family: 'Playfair Display', serif; /* 复古衬线体 */
  color: #fff;
  font-size: 32px;
  margin: 0 0 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  letter-spacing: 1px;
}

.lead {
  font-size: 12px;
  color: var(--primary-gold);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
}

/* 输入框 */
.input-group {
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  font-size: 13px;
  color: var(--text-gray);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

input {
  width: 100%;
  padding: 12px 15px;
  background: rgba(0, 0, 0, 0.2); /* 输入框半透明 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  background: rgba(0, 0, 0, 0.4);
  border-color: var(--primary-gold); /* 聚焦变金 */
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

/* 记住密码 & 忘记密码 */
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 13px;
  color: var(--text-gray);
}
/* --------------- 修改部分开始 --------------- */

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none; /* 防止双击选中文字 */
  padding: 5px 0;    /* 增加一点点击区域 */
}

/* 隐藏原生 checkbox */
.checkbox-container input { display: none; }

/* 自定义选框 */
.checkmark {
  width: 18px;         /* 加大尺寸 (原14px) */
  height: 18px;

  /* 未选中状态：深色底 + 亮色边框，形成凹槽感 */
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.4); /* 边框加粗变亮 */

  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.5); /* 内部阴影增加立体感 */
}

/* 鼠标悬停时的效果 */
.checkbox-container:hover .checkmark {
  border-color: #fff; /* 悬停时边框变白 */
  box-shadow: 0 0 5px rgba(255,255,255,0.2);
}

/* 选中状态 */
.checkbox-container input:checked ~ .checkmark {
  background: var(--primary-gold);
  border-color: var(--primary-gold);
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.4); /* 选中发光 */
}

/* 对勾图标 (CSS画的对勾) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid #1a1f2c; /* 深色对勾 */
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 选中时显示对勾 */
.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

/* 文字部分 */
.checkbox-container .text {
  color: var(--text-gray);
  font-size: 14px;
  transition: color 0.3s;
}

/* 悬停或选中时文字变亮 */
.checkbox-container:hover .text,
.checkbox-container input:checked ~ .text {
  color: #fff;
  text-shadow: 0 0 8px rgba(255,255,255,0.3);
}

/* --------------- 修改部分结束 --------------- */
.checkbox-container:hover .text { color: #fff; }

.forgot-link {
  color: var(--text-gray);
  text-decoration: none;
  border-bottom: 1px dotted transparent;
  transition: all 0.3s;
}
.forgot-link:hover {
  color: var(--primary-gold);
  border-bottom-color: var(--primary-gold);
}

/* 按钮 */
.btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #d4af37 0%, #a6892b 100%);
  color: #111;
  font-weight: 700;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}
.btn:disabled {
  background: #555;
  color: #888;
  cursor: not-allowed;
}

/* 错误提示 */
.error {
  margin-top: 15px;
  padding: 10px;
  background: rgba(255, 77, 79, 0.1);
  border: 1px solid rgba(255, 77, 79, 0.3);
  color: #ff7875;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
}

/* 动画 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>