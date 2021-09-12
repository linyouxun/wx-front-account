//index.js
const app = getApp();

Page({
  data: {
    avatarUrl: "./user-unlogin.png",
    userInfo: {},
    hasUserInfo: false,
    logged: false,
    takeSession: false,
    requestResult: "",
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse("open-data.type.userAvatarUrl"), // 如需尝试获取用户信息可改为false
  },

  onLoad: async function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: "../chooseLib/chooseLib",
      });
      return;
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }

    const res = await wx.cloud.callContainer({
      config: {
        env: 'account-8gjt64jg11892b13',
      },
      path: '/api/user/info', // 填入业务自定义路径和参数
      method: 'GET',
      header: {
        'X-WX-SERVICE': 'account', // 填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
      }
      // 其余参数同 wx.request
    });
    
    console.log(res);
  },

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: "展示用户信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      },
    });
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      });
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: "login",
      data: {},
      success: (res) => {
        console.log("[云函数] [login] user openid: ", res.result.openid);
        app.globalData.openid = res.result.openid;
        wx.navigateTo({
          url: "../Home/Home",
        });
      },
      fail: (err) => {
        console.error("[云函数] [login] 调用失败", err);
        wx.navigateTo({
          url: "../deployFunctions/deployFunctions",
        });
      },
    });
  },
});
