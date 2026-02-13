// pages/profile-setup/profile-setup.js
Page({
  data: {
    campusOptions: ['东校区', '北校区', '主校区'],
    campusIndex: 0,
    campus: '',
    realName: '',
    studentId: '',
    dormBuilding: '',
    dormRoom: ''
  },

  onLoad(options) {
    // 可以从缓存中读取用户基本信息（昵称、头像等）
    const userProfile = wx.getStorageSync('userProfile');
    if (userProfile && userProfile.isProfileCompleted) {
      // 如果已经完善过资料，直接跳转到首页
      wx.reLaunch({ url: '/pages/index/index' });
    }
  },

  onCampusChange(e) {
    const index = e.detail.value;
    this.setData({
      campusIndex: index,
      campus: this.data.campusOptions[index]
    });
  },

  onRealNameInput(e) {
    this.setData({ realName: e.detail.value });
  },

  onStudentIdInput(e) {
    this.setData({ studentId: e.detail.value });
  },

  onDormBuildingInput(e) {
    this.setData({ dormBuilding: e.detail.value });
  },

  onDormRoomInput(e) {
    this.setData({ dormRoom: e.detail.value });
  },

  handleSubmit() {
    const { campus, realName, studentId, dormBuilding, dormRoom } = this.data;

    // 验证必填项
    if (!campus) {
      wx.showToast({ title: '请选择校区', icon: 'none' });
      return;
    }
    if (!realName) {
      wx.showToast({ title: '请输入真实姓名', icon: 'none' });
      return;
    }
    if (!studentId) {
      wx.showToast({ title: '请输入学号/工号', icon: 'none' });
      return;
    }
    if (!dormBuilding) {
      wx.showToast({ title: '请输入宿舍楼栋', icon: 'none' });
      return;
    }
    if (!dormRoom) {
      wx.showToast({ title: '请输入宿舍房间号', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    // 获取当前用户信息
    const userProfile = wx.getStorageSync('userProfile');
    if (!userProfile || !userProfile.openid) {
      wx.hideLoading();
      wx.showToast({ title: '用户信息异常，请重新登录', icon: 'none' });
      setTimeout(() => {
        wx.reLaunch({ url: '/pages/login/login' });
      }, 1500);
      return;
    }

    // 提交到后端
    wx.request({
      url: 'http://localhost:8080/api/wx/user/complete-profile',
      method: 'POST',
      data: {
        openid: userProfile.openid,
        campus,
        realName,
        studentId,
        dormBuilding,
        dormRoom
      },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200 && res.data.success) {
          // 更新本地缓存
          const updatedProfile = {
            ...userProfile,
            campus,
            realName,
            studentId,
            dormBuilding,
            dormRoom,
            isProfileCompleted: true
          };
          wx.setStorageSync('userProfile', updatedProfile);

          wx.showToast({ title: '信息提交成功', icon: 'success' });
          setTimeout(() => {
            wx.reLaunch({ url: '/pages/index/index' });
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.message || '提交失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('提交失败:', err);
        wx.showToast({ title: '网络错误，请重试', icon: 'none' });
      }
    });
  }
});

