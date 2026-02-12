// pages/user/user.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    statusBarHeight: 20,
    navBarHeight: 44,
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '未登录',
      userId: ''
    },
    showNameModal: false,
    tempNickName: '',
    
    // 菜单数据保持不变...
    menuList1: [
      { name: '我的徽章', icon: '/images/menu/achievement.png' },
      { name: '我的兑换', icon: '/images/menu/exchange.png' },
      { name: '我的校园/集体荣誉', icon: '/images/menu/camera.png' },
    ],
    menuList2: [
      { name: '常见问题', icon: '/images/menu/faq.png' },
      { name: '意见建议', icon: '/images/menu/feedback.png' },
      { name: '关于碳惠校园', icon: '/images/menu/about.png' },
      { name: '用户协议', icon: '/images/menu/contract.png' }
    ],
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: sysInfo.statusBarHeight });
  },

  onShow() {
    this.loadUserInfo();
  },

  // 加载用户信息 (读取缓存)
// --- 核心修复：全能加载函数 ---
  // 自动兼容 nickname/nickName 和 avatar_url/avatarUrl
  // --- 核心修复：全能加载函数 ---
  // 自动兼容 nickname/nickName 和 avatar_url/avatarUrl
  loadUserInfo() {
    const userProfile = wx.getStorageSync('userProfile');
    
    if (userProfile && userProfile.isLogin) {
      // 1. 优先取 nickName (前端改过的)，没有就取 nickname (数据库存的)，都没有就“微信用户”
      const displayNickName = userProfile.nickName || userProfile.nickname || '微信用户';
      
      // 2. 优先取 avatarUrl，没有就取 avatar_url，都没有就默认
      const displayAvatar = userProfile.avatarUrl || userProfile.avatar_url || defaultAvatarUrl;

      // 3. 处理 ID (兼容 openid 字段)
      const realId = userProfile.openid || '';
      const displayId = realId ? (realId.substring(0, 4) + '****' + realId.substring(realId.length - 4)) : '181****2540';

      this.setData({
        'userInfo.avatarUrl': displayAvatar,
        'userInfo.nickName': displayNickName,
        'userInfo.userId': displayId
      });
    }
  },

  goBack() {
    wx.navigateBack({ fail: () => wx.reLaunch({ url: '/pages/index/index' }) });
  },

  // --- 1. 修改头像 ---
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    
    // A. 更新页面
    this.setData({ 'userInfo.avatarUrl': avatarUrl });
    
    // B. 更新缓存
    this.updateLocalCache('avatarUrl', avatarUrl);

    // C. 🚀 同步更新数据库
    this.updateUserInfoInDB('avatarUrl', avatarUrl);
  },

  // --- 2. 修改昵称 ---
  showEditNameModal() {
    this.setData({ showNameModal: true, tempNickName: this.data.userInfo.nickName });
  },
  closeEditNameModal() {
    this.setData({ showNameModal: false });
  },
  onNicknameInput(e) {
    this.setData({ tempNickName: e.detail.value });
  },
  onNicknameConfirm(e) {
    const newName = e.detail.value || this.data.tempNickName;
    if (!newName) return wx.showToast({ title: '不能为空', icon: 'none' });

    // A. 更新页面
    this.setData({ 'userInfo.nickName': newName, showNameModal: false });

    // B. 更新缓存
    this.updateLocalCache('nickName', newName);

    // C. 🚀 同步更新数据库
    this.updateUserInfoInDB('nickName', newName);
  },

  // --- 辅助函数：更新本地缓存 ---
  updateLocalCache(key, value) {
    const userProfile = wx.getStorageSync('userProfile') || {};
    userProfile[key] = value;
    wx.setStorageSync('userProfile', userProfile);
  },

  // --- 核心新增：调用后端接口更新数据库 ---
  updateUserInfoInDB(field, value) {
    const openid = this.data.userInfo.userId; // 这里我们之前存了openid
    
    if (!openid || openid.includes('****')) {
      // 如果是模拟ID或者是未登录状态，就不发请求了
      console.log('未获取有效OpenID，仅本地修改');
      return;
    }

    wx.request({
      url: 'http://localhost:3000/api/updateUser', // 你的后端地址
      method: 'POST',
      data: {
        openid: openid,
        field: field, // 'avatarUrl' 或 'nickName'
        value: value
      },
      success: (res) => {
        if (res.data.success) {
          console.log('数据库更新成功');
          wx.showToast({ title: '保存成功', icon: 'success' });
        } else {
          console.error('数据库更新失败', res.data);
        }
      },
      fail: (err) => {
        console.error('请求后端失败', err);
      }
    });
  },

  // ID格式化显示 (仅用于wxml显示，不影响逻辑)
  getDisplayUserId() {
    const id = this.data.userInfo.userId;
    if (!id || id.length < 8) return '181****2540';
    return id.substring(0, 4) + '****' + id.substring(id.length - 4);
  },

  handleMenuClick(e) {
    wx.showToast({ title: '点击: ' + e.currentTarget.dataset.name, icon: 'none' });
  }
})