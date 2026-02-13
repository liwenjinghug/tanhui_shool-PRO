// pages/index/index.js
import * as echarts from '../../ec-canvas/echarts'; // 引入 ECharts 库

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// --- A. 定义图表初始化函数 (放在 Page 外面) ---
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);

  // 模拟未来7天趋势数据
  const xData = ['今天', '明天', '周六', '周日', '周一', '周二', '周三'];
  const yData = [58, 45, 62, 110, 80, 50, 42]; // 模拟AQI数值

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: [10, 15],
      textStyle: { color: '#333', fontSize: 12 },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px;'
    },
    grid: {
      left: '3%', right: '4%', bottom: '3%', top: '15%',
      containLabel: true,
      show: false
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#999', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      splitLine: { show: true, lineStyle: { type: 'dashed', color: '#eee' } },
      axisLabel: { color: '#999', fontSize: 11 }
    },
    series: [{
      name: 'AQI指数',
      type: 'line',
      smooth: true, // 平滑曲线
      symbol: 'circle',
      symbolSize: 8, // 节点稍微大一点
      itemStyle: {
        color: '#4caf50', // 绿色主色调
        borderColor: '#fff',
        borderWidth: 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowBlur: 5
      },
      lineStyle: { width: 3, shadowColor: 'rgba(76, 175, 80, 0.3)', shadowBlur: 10 },
      // 区域渐变填充
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0, color: 'rgba(76, 175, 80, 0.4)' 
        }, {
          offset: 1, color: 'rgba(76, 175, 80, 0.05)' 
        }])
      },
      data: yData
    }]
  };

  chart.setOption(option);
  return chart;
}

// --- B. Page 逻辑 ---
Page({
  data: {
    // --- 1. 图表绑定 ---
    ec: {
      onInit: initChart // 绑定上面的函数
    },

    // --- 2. 用户信息 ---
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '加载中...',
      points: 0
    },
    
    // --- 3. 顶部导航 ---
    topNavList: [
      { name: '个人中心', icon: '/images/icon-person.png', url: '/pages/user/user' },
      { name: '我的成就', icon: '/images/icon-medal.png', url: '/pages/achievement/index' },
      { name: '排行榜', icon: '/images/icon-news.png', url: '/pages/news/index' },
      { name: '规则', icon: '/images/icon-rule.png', url: '/pages/rule/index' }
    ],

    // --- 4. 空气指数相关 ---
    aqiValue: '--', 
    aqiLevel: '查询中',
    currentCity: '定位中...', 
    lastAQITime: 0,          
    showAQIModal: false,     

    // 空气详情数据 (初始化)
    aqiDetails: { pm25: '-', pm10: '-', no2: '-', so2: '-', co: '-', o3: '-' },
    
    // --- 5. 数据库任务列表 ---
    todayBehaviors: [] 
  },

  onShow() {
    this.checkLoginStatus(); // 先读缓存显示基本信息
    
    // 🚀 新增：每次回到首页，都去服务器拉取最新的积分
    this.syncUserPoints();

    // 逻辑：如果当前没有定位城市，就发起定位；否则检查是否需要自动刷新
    if (this.data.currentCity === '定位中...' || this.data.currentCity === '定位失败') {
      this.getLocation();
    } else {
      this.checkAutoRefreshAQI();
    }
  },

  // --- 新增函数：同步用户最新积分 ---
  syncUserPoints() {
    const userProfile = wx.getStorageSync('userProfile');
    if (!userProfile || !userProfile.openid) return;

    wx.request({
      url: 'http://localhost:8080/api/wx/user/info', // 调用刚才写的接口
      method: 'GET',
      data: { openid: userProfile.openid },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const remoteUser = res.data;
          
          console.log('积分同步成功，当前积分为:', remoteUser.points);

          // 1. 更新页面显示
          this.setData({
            'userInfo.points': remoteUser.points,
            // 顺便把昵称头像也同步一下，防止数据库改了这边没变
            'userInfo.nickName': remoteUser.nickname || userProfile.nickName, 
            'userInfo.avatarUrl': remoteUser.avatar_url || userProfile.avatarUrl
          });

          // 2. 更新本地缓存 (关键！下次进来就准了)
          userProfile.points = remoteUser.points;
          userProfile.nickName = remoteUser.nickname || userProfile.nickName;
          userProfile.avatarUrl = remoteUser.avatar_url || userProfile.avatarUrl;
          wx.setStorageSync('userProfile', userProfile);
        }
      },
      fail: (err) => {
        console.error('积分同步失败', err);
      }
    });
  },

  // --- 核心功能 1：腾讯IP定位 ---
  getLocation() {
    const TENCENT_KEY = 'I4LBZ-AZNL3-R7K3J-OWJLF-4RCVE-RTFCJ'; // 你的 Key

    wx.request({
      url: 'https://apis.map.qq.com/ws/location/v1/ip',
      method: 'GET',
      data: { key: TENCENT_KEY, output: 'json' },
      success: (res) => {
        console.log('腾讯定位结果:', res.data);
        if (res.data.status === 0) {
          const city = res.data.result.ad_info.city;
          this.setData({ currentCity: city });
          // 定位成功后，立刻查空气
          this.refreshAQI(city); 
        } else {
          console.warn('定位异常:', res.data.message);
          this.handleLocationFail();
        }
      },
      fail: (err) => {
        console.error('定位网络失败', err);
        this.handleLocationFail();
      }
    });
  },

  handleLocationFail() {
    this.setData({ currentCity: '成都市' });
    this.refreshAQI('成都市');
  },

  // --- 核心功能 2：查空气质量 ---
  refreshAQI(cityInput) {
    const targetCity = cityInput || this.data.currentCity || '成都市';
    if (targetCity === '定位中...' || targetCity === '定位失败') return;

    if (this.data.aqiValue === '--') {
      wx.showLoading({ title: '更新数据...' });
    }

    const TANSHU_KEY = 'b5c36542d23ad74f77ab2ddf862e2f6a'; // 你的 Key

    wx.request({
      url: 'https://api.tanshuapi.com/api/air_quality/v1/index',
      method: 'GET',
      data: { key: TANSHU_KEY, area: targetCity },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code === 1 && res.data.data) {
          const apiData = res.data.data;
          this.setData({
            aqiValue: apiData.aqi,
            aqiLevel: apiData.quality,
            lastAQITime: Date.now(),
            aqiDetails: {
              pm25: apiData.pm2_5,
              pm10: apiData.pm10,
              no2: apiData.no2,
              so2: apiData.so2,
              co: apiData.co,
              o3: apiData.o3
            }
          });
        } else {
          // API 返回错误或无数据，使用模拟数据
          console.warn('API返回异常，启用模拟数据', res);
          this.useMockAQIData();
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('API请求失败，启用模拟数据', err);
        this.useMockAQIData();
      }
    });
  },

  useMockAQIData() {
    this.setData({
      aqiValue: '45',
      aqiLevel: '优',
      lastAQITime: Date.now(),
      aqiDetails: {
        pm25: '28',
        pm10: '42',
        no2: '35',
        so2: '8',
        co: '0.6',
        o3: '92'
      }
    });
    // 显示轻提示告知用户（可选）
    // wx.showToast({ title: '已切换至模拟数据', icon: 'none' });
  },

  // --- 辅助功能：30分钟自动刷新 ---
  checkAutoRefreshAQI() {
    const now = Date.now();
    const interval = 30 * 60 * 1000;
    if (now - this.data.lastAQITime > interval) {
      console.log('数据过期，自动刷新...');
      this.refreshAQI();
    }
  },

  // --- 交互：弹窗控制 ---
  onOpenAQI() { this.setData({ showAQIModal: true }); },
  onCloseAQI() { this.setData({ showAQIModal: false }); },

  // --- 登录与后端逻辑 ---
  checkLoginStatus() {
    const userProfile = wx.getStorageSync('userProfile');
    const EXPIRE_TIME = 10 * 60 * 1000; // 10分钟

    if (userProfile && userProfile.isLogin) {
      const now = Date.now();
      const lastActive = userProfile.lastActiveTime || 0;

      if (now - lastActive > EXPIRE_TIME) {
        wx.removeStorageSync('userProfile');
        wx.showModal({
          title: '登录过期',
          content: '您已超过10分钟未访问，请重新登录',
          showCancel: false,
          success: () => { wx.reLaunch({ url: '/pages/login/login' }); }
        });
        return;
      }
      
      // 续期
      userProfile.lastActiveTime = now;
      wx.setStorageSync('userProfile', userProfile);

      this.setData({
        'userInfo.avatarUrl': userProfile.avatar_url || userProfile.avatarUrl || defaultAvatarUrl,
        'userInfo.nickName': userProfile.nickname || userProfile.nickName,
        'userInfo.points': userProfile.points || 0
      });

      if (userProfile.openid) {
        this.fetchTaskData(userProfile.openid);
      }
    } else {
      wx.reLaunch({ url: '/pages/login/login' });
    }
  },

  fetchTaskData(openid) {
    wx.request({
      url: 'http://localhost:8080/api/wx/home/tasks',
      method: 'GET',
      data: { openid },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ todayBehaviors: res.data });
        }
      }
    });
  },

 navigateToPage(e) {
    const url = e.currentTarget.dataset.url;
    
    if (!url) return;

    // 真正的跳转逻辑
    wx.navigateTo({
      url: url,
      fail: (err) => {
        // 如果跳转失败（比如路径不对），会在控制台打印错误
        console.error('跳转失败，请检查路径:', url, err);
        wx.showToast({ title: '页面路径错误', icon: 'none' });
      }
    });
  },
  onTapFeature(e) { wx.showToast({ title: '点击: ' + e.currentTarget.dataset.name, icon: 'none' }) }
})