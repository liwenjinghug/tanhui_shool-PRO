<template>
  <div class="profile-container">
    <div class="profile-layout">
      <!-- Left Card: User Info -->
      <div class="card user-card">
        <div class="card-body centered">
          <div class="avatar-wrapper" @click="openAvatarDialog">
            <img :src="displayAvatar" class="avatar-img" alt="User Avatar" />
            <div class="avatar-overlay">
              <span>更换头像</span>
            </div>
          </div>
          <h2 class="username">{{ userForm.realName || userForm.nickname || userForm.username || '用户' }}</h2>
          <p class="user-desc">{{ userForm.deptName || '碳惠校园管理平台' }}</p>

          <div class="user-meta">
            <div class="meta-item">
              <span class="label">登录账号</span>
              <span class="value">{{ userForm.username || '-' }}</span>
            </div>
            <div class="meta-item">
              <span class="label">学号/工号</span>
              <span class="value">{{ userForm.studentId || '-' }}</span>
            </div>
            <div class="meta-item">
              <span class="label">所属部门</span>
              <span class="value">{{ userForm.deptName || '-' }}</span>
            </div>
            <div class="meta-item">
              <span class="label">角色权限</span>
              <span class="value">{{ getRoleName(userForm.role) }}</span>
            </div>
            <div class="meta-item">
              <span class="label">注册时间</span>
              <span class="value">{{ formatDate(userForm.createTime) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Card: Edit -->
      <div class="card edit-card">
        <div class="card-header">
          <div
            class="tab-btn"
            :class="{ active: activeTab === 'info' }"
            @click="activeTab = 'info'"
          >
            基本资料
          </div>
          <div
            class="tab-btn"
            :class="{ active: activeTab === 'pwd' }"
            @click="activeTab = 'pwd'"
          >
            修改密码
          </div>
        </div>

        <div class="card-body">
          <!-- Edit Info -->
          <transition name="fade" mode="out-in">
            <div v-if="activeTab === 'info'" key="info" class="form-wrapper">
              <el-form :model="userForm" label-position="top">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="用户昵称">
                      <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="手机号码">
                      <el-input v-model="userForm.phonenumber" placeholder="请输入手机号" maxlength="11" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="12">
                     <el-form-item label="电子邮件">
                      <el-input v-model="userForm.email" placeholder="请输入邮箱" maxlength="50" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="性别">
                      <el-radio-group v-model="userForm.sex">
                        <el-radio value="0">男</el-radio>
                        <el-radio value="1">女</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item>
                  <el-button type="primary" @click="submitUserInfo" :loading="loading">保存配置</el-button>
                  <el-button @click="resetUserInfo">重置</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- Change Password -->
            <div v-else key="pwd" class="form-wrapper">
              <el-form :model="pwdForm" :rules="pwdRules" ref="pwdRef" label-position="top">
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入旧密码" />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="请输入新密码" />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitPwd" :loading="loading">确认修改</el-button>
                </el-form-item>
              </el-form>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Avatar Selection Dialog -->
    <el-dialog v-model="avatarDialogVisible" title="选择头像" width="500px" center custom-class="avatar-dialog">
      <div class="avatar-grid">
        <div
          v-for="(img, index) in avatarList"
          :key="index"
          class="avatar-option"
          :class="{ selected: selectedAvatar === img.path }"
          @click="selectedAvatar = img.path"
        >
          <img :src="img.src" alt="Avatar Option" />
          <div class="option-label">{{ img.name }}</div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="avatarDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAvatar">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
// Assume we will add these to api/user.js
import { getUserProfile, updateUserProfile, updateUserPwd } from '../api/user'

// Assets import for Vite - 导入所有可用头像
import avatarDefault from '../assets/头像.png'
import avatarBoy from '../assets/头像 男孩.png'
import avatarGirl from '../assets/头像 女孩.png'

const activeTab = ref('info')
const loading = ref(false)
const userForm = reactive({
  id: '',
  username: '',
  realName: '',
  nickname: '',
  phonenumber: '',
  email: '',
  sex: '0',
  studentId: '',
  deptName: '',
  createTime: '',
  avatarUrl: ''
})

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const pwdRef = ref(null)

const pwdRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请���认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== pwdForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// Avatar handling
const avatarDialogVisible = ref(false)
const selectedAvatar = ref('')
const avatarList = [
  { name: '默认头像', path: 'default', src: avatarDefault },
  { name: '男孩头像', path: 'boy', src: avatarBoy },
  { name: '女孩头像', path: 'girl', src: avatarGirl }
]

const displayAvatar = computed(() => {
  if (userForm.avatarUrl === 'boy') return avatarBoy
  if (userForm.avatarUrl === 'girl') return avatarGirl
  if (userForm.avatarUrl === 'default') return avatarDefault
  // If it's a full URL or blob
  if (userForm.avatarUrl && (userForm.avatarUrl.startsWith('http') || userForm.avatarUrl.startsWith('data:'))) {
    return userForm.avatarUrl
  }
  return avatarDefault
})

function openAvatarDialog() {
  selectedAvatar.value = userForm.avatarUrl || 'default'
  avatarDialogVisible.value = true
}

async function confirmAvatar() {
  userForm.avatarUrl = selectedAvatar.value
  avatarDialogVisible.value = false

  // 调用 API 更新（Mock 模式会自动更新 localStorage）
  try {
    await updateUserProfile({ avatarUrl: selectedAvatar.value })
    ElMessage.success('头像修改成功')

    // 触发 Topbar 刷新
    window.dispatchEvent(new Event('user-profile-updated'))
  } catch (e) {
    console.warn('头像修改失败', e)
    ElMessage.error('头像修改失败，请稍后重试')
  }
}

// Data fetching
async function initData() {
  // 先从 localStorage 加载数据（确保有基础数据）
  const localUser = JSON.parse(localStorage.getItem('auth_user') || '{}')

  // 设置默认值，确保所有字段都有值
  const defaultData = {
    id: localUser.id || '',
    username: localUser.username || '',
    realName: localUser.realName || localUser.username || '',
    nickname: localUser.nickname || localUser.realName || localUser.username || '',
    phonenumber: localUser.phonenumber || localUser.phone || '',
    email: localUser.email || '',
    sex: localUser.sex || '0',
    studentId: localUser.studentId || localUser.id || '',
    deptName: localUser.deptName || localUser.dept || '',
    createTime: localUser.createTime || '',
    avatarUrl: localUser.avatarUrl || 'default'
  }

  // 先用本地数据填充表单
  Object.assign(userForm, defaultData)

  // 然后尝试从 API 获取最新数据
  try {
    const res = await getUserProfile()
    if (res && res.data) {
      // API 数据优先，但保留本地有而 API 没有的字段
      Object.keys(res.data).forEach(key => {
        if (res.data[key] !== null && res.data[key] !== undefined && res.data[key] !== '') {
          userForm[key] = res.data[key]
        }
      })

      // 更新 localStorage 为最新数据
      const updated = { ...localUser, ...res.data }
      localStorage.setItem('auth_user', JSON.stringify(updated))
    }
  } catch (e) {
    console.warn('从服务器获取用户信息失败，使用本地数据', e)
    // 失败了也没关系，已经用本地数据填充了
  }
}

async function submitUserInfo() {
  loading.value = true
  try {
    // 调用 API 更新（Mock 模式会自动更新 localStorage）
    await updateUserProfile(userForm)
    ElMessage.success('修改成功')

    // 触发 Topbar 刷新
    window.dispatchEvent(new Event('user-profile-updated'))
  } catch (e) {
    console.error('提交用户信息失败', e)
    ElMessage.error('修改失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

function resetUserInfo() {
  initData()
}

// 工具函数：角色名称映射
function getRoleName(role) {
  const roleMap = {
    'super': '超级管理员',
    'operator': '运营人员',
    'auditor': '审计人员',
    'data_admin': '数据管理员'
  }
  return roleMap[role] || role || '-'
}

// 工具函数：日期格式化
function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    // 如果是完整的日期时间字符串（如 "2026-02-11 18:25:28"）
    if (typeof dateStr === 'string' && dateStr.includes(' ')) {
      return dateStr.split(' ')[0] // 只返回日期部分
    }
    // 如果是 Date 对象或其他格式
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr // 无法解析则返回原值
    return date.toISOString().split('T')[0]
  } catch {
    return dateStr
  }
}

async function submitPwd() {
  if (!pwdRef.value) return
  await pwdRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await updateUserPwd(pwdForm.oldPassword, pwdForm.newPassword)
        ElMessage.success('密码修改成功，请重新登录')
        setTimeout(() => {
          localStorage.clear()
          window.location.href = '/login' // Force reload to login
        }, 1500)
      } catch (e) {
        console.error(e)
        ElMessage.error('修改密码失败，请检查旧密码')
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  initData()
})
</script>

<style scoped>
.profile-container {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
}

.profile-layout {
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.user-card {
  width: 380px;
  flex-shrink: 0;
  text-align: center;
}

.edit-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-body.centered {
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Avatar Styles */
.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 24px;
  cursor: pointer;
  border: 4px solid #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.avatar-wrapper:hover .avatar-img {
  transform: scale(1.1);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.username {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.user-desc {
  margin: 0 0 32px;
  color: #888;
  font-size: 14px;
}

.user-meta {
  width: 100%;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 14px;
}

.meta-item .label {
  color: #666;
}

.meta-item .value {
  color: #333;
  font-weight: 500;
}

/* Edit Card */
.card-header {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.tab-btn {
  padding: 16px 24px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  position: relative;
  transition: color 0.3s;
}

.tab-btn:hover {
  color: #409eff;
}

.tab-btn.active {
  color: #409eff;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #409eff;
}

.card-body {
  padding: 32px;
}

.form-wrapper {
  max-width: 600px;
}

/* Avatar Dialog */
.avatar-grid {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 20px 0;
}

.avatar-option {
  width: 100px;
  text-align: center;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 8px;
  transition: all 0.2s;
}

.avatar-option:hover {
  background: #f5f7fa;
}

.avatar-option.selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.avatar-option img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 8px;
}

.option-label {
  font-size: 13px;
  color: #666;
}


</style>
