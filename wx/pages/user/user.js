Page({
  data: {
    statusBarHeight: 20,
    userInfo: {},
    showEditModal: false,
    tempData: {},
    campusOptions: ['东校区', '北校区', '主校区'],
    // 菜单配置
    menuList1: [
      { name: '我的徽章', icon: '/images/menu/achievement.png' },
      { name: '我的兑换', icon: '/images/menu/exchange.png' },
      { name: '校园荣誉', icon: '/images/menu/camera.png' }
    ],
    menuList2: [
      { name: '常见问题', icon: '/images/menu/faq.png' },
      { name: '意见建议', icon: '/images/menu/feedback.png' },
      { name: '关于我们', icon: '/images/menu/about.png' }
    ]
  },

  onLoad() {
    // 获取系统信息以适配状态栏高度
    const sysInfo = wx.getSystemInfoSync();
    this.setData({ 
      statusBarHeight: sysInfo.statusBarHeight 
    });
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  goBack() {
    wx.navigateBack({ 
      fail: () => wx.reLaunch({ url: '/pages/index/index' }) 
    });
  },

  loadUserInfo() {
    const userProfile = wx.getStorageSync('userProfile');
    if (userProfile) {
      this.setData({ userInfo: userProfile });
    }
  },

  // 打开统一修改弹窗
  openEdit() {
    this.setData({
      showEditModal: true,
      tempData: { ...this.data.userInfo } // 载入当前数据到临时变量
    });
  },

  onModalInput(e) {
    const field = e.currentTarget.dataset.f;
    this.setData({ [`tempData.${field}`]: e.detail.value });
  },

  onCampusChange(e) {
    this.setData({ 'tempData.campus': this.data.campusOptions[e.detail.value] });
  },

  saveInfo() {
    const updated = this.data.tempData;
    // 更新本地缓存
    wx.setStorageSync('userProfile', updated);
    this.setData({ 
      userInfo: updated, 
      showEditModal: false 
    });
    
    // 调用更新接口（此处可以根据实际后端接口补全请求逻辑）
    wx.showToast({ title: '修改成功', icon: 'success' });
  },

  closeModal() {
    this.setData({ showEditModal: false });
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({ 'userInfo.avatarUrl': avatarUrl });
    // 同时更新缓存
    const userProfile = wx.getStorageSync('userProfile') || {};
    userProfile.avatarUrl = avatarUrl;
    wx.setStorageSync('userProfile', userProfile);
  },

  handleMenuClick(e) {
    const name = e.currentTarget.dataset.name;
    wx.showToast({ title: '点击了' + name, icon: 'none' });
  },

  stopBubble() {} // 阻止头像点击事件冒泡到卡片点击事件
});