//Home.js
import request from "../../utils/request";

Page({
  data: {
    avatarUrl: "./user-unlogin.png",
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse("open-data.type.userAvatarUrl"), // 如需尝试获取用户信息可改为false
    date: "",
    list: [],
  },
  onShow() {
    const current = new Date();
    const date = `${current.getFullYear()}-${current
      .getMonth()
      .toString()
      .padStart(2, 0)}-${current.getDay().toString().padStart(2, 0)}`;
    this.setData({ date });
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
    this.fetchList(date);
  },
  onLoad: async function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: "../chooseLib/chooseLib",
      });
      return;
    }
  },

  async fetchList(date) {
    wx.showLoading({
      title: '加载中',
    })
    const res = await request("/api/expenses/list", {
      data: { useTime: date },
    });
    const list = res.data.data.map((ele) => {
      const data = {
        ...ele,
        moneyFormat: ((ele.money || 0) / 100).toFixed(2) + "￥",
        useTimeFormat: ele.useTime.replace(
          /(\d{4}-\d{2}-\d{2}).*(\d{2}:\d{2}:\d{2}).*/g,
          "$1 $2"
        ),
      };
      data.url =
        "../ExpenseEdit/ExpenseEdit?" +
        Object.keys(data)
          .map((item) => {
            return `${item}=${data[item] || ''}`;
          })
          .join("&");
      return data;
    });
    wx.hideLoading()
    this.setData({
      list,
    });
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

  bindDateChange: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    this.setData({
      date: e.detail.value,
    });
  },
  add: function() {
    wx.navigateTo({
      url: '../ExpenseEdit/ExpenseEdit?accountId=2',
     })
  }
});
