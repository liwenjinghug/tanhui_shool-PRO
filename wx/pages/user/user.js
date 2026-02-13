Page({
  data: {
    userInfo: {},
    showEditModal: false,
    tempData: {},
    campusOptions: ['东校区', '北校区', '主校区'],
    // 菜单配置 [cite: 50, 52]
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

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const userProfile = wx.getStorageSync('userProfile');
    if (userProfile) {
      this.setData({ userInfo: userProfile });
    }
  },

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
    this.setData({ userInfo: updated, showEditModal: false });
    
    // 调用更新接口
    this.updateUserInfoInDB(updated);
    wx.showToast({ title: '修改成功', icon: 'success' });
  },

  updateUserInfoInDB(data) {
    // 逻辑同你提供的 user.js，发送数据到后端
  },

  closeModal() {
    this.setData({ showEditModal: false });
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({ 'userInfo.avatarUrl': avatarUrl });
    // 缓存同步逻辑...
  },

  stopBubble() {} // 阻止事件冒泡
});