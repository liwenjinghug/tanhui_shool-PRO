// pages/login/login.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: ''
    }
  },

  onLoad() {
    // 如果本地有 openid（非首次登录），尝试从服务器拿回最新的昵称和头像并填充
    const userProfile = wx.getStorageSync('userProfile');
    if (userProfile && userProfile.openid) {
      wx.request({
        url: `http://localhost:8080/api/wx/user/info?openid=${userProfile.openid}`,
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            const serverUser = res.data;
            const nick = serverUser.nickname || userProfile.nickname || '';
            const avatar = serverUser.avatarUrl || userProfile.avatarUrl || defaultAvatarUrl;

            this.setData({
              'userInfo.nickName': nick,
              'userInfo.avatarUrl': avatar
            });

            // 合并并更新本地缓存的信息，保持最新
            const merged = Object.assign({}, userProfile, serverUser, { nickname: nick, avatarUrl: avatar });
            wx.setStorageSync('userProfile', merged);
          }
        },
        fail: (err) => {
          // 静默失败，不影响登录流程
          console.warn('获取用户信息失败:', err);
        }
      });
    }
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({ 'userInfo.avatarUrl': avatarUrl });
  },

  onInputChange(e) {
    const nickName = e.detail.value;
    this.setData({ 'userInfo.nickName': nickName });
  },

  handleLogin() {
    const { nickName, avatarUrl } = this.data.userInfo;
    if (!nickName) {
      wx.showToast({ title: '请输入昵称', icon: 'error' });
      return;
    }

    wx.showLoading({ title: '登录中...' });

    // 使用缓存中的 openid（如果有），方便非首次登录直接复用
    const storedProfile = wx.getStorageSync('userProfile') || {};
    const mockOpenid = storedProfile.openid || 'test_user_888';

    wx.request({
      url: 'http://localhost:8080/api/wx/auth/login',
      method: 'POST',
      data: {
        openid: mockOpenid,
        nickname: nickName,
        avatarUrl: avatarUrl
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200 && res.data) {
          console.log('登录成功，用户信息:', res.data);

          // 保存用户信息到本地缓存
          const userProfile = {
            ...res.data,
            isLogin: true,
            lastActiveTime: Date.now()
          };
          wx.setStorageSync('userProfile', userProfile);

          wx.showToast({ title: '登录成功', icon: 'success' });

          setTimeout(() => {
            // 检查是否需要完善资料
            if (!res.data.isProfileCompleted) {
              // 首次登录，跳转到资料完善页面
              wx.redirectTo({ url: '/pages/profile-setup/profile-setup' });
            } else {
              // 已完善资料，直接进入首页
              wx.reLaunch({ url: '/pages/index/index' });
            }
          }, 1000);
        } else {
          wx.showToast({ title: '登录失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('登录请求失败:', err);
        wx.showModal({
          title: '连接失败',
          content: '无法连接后端，请检查服务器是否运行',
          showCancel: false
        });
      }
    });
  }
})