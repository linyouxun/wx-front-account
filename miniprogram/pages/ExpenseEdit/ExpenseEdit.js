// pages/ExpenseEdit.js
import request from "../../utils/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    typeList: ["购物", "餐饮", "路费"],
    type: undefined,
    time: undefined,
    textarea: undefined,
    money: undefined,
    accountId: "",
    id: ''
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.id ? '编辑信息': '新增信息'
    })
    if (options.id ) {
      this.setData({
        id: options.id,
        accountId: options.accountId,
        type: options.type,
        money: (options.money ||  0 )/ 100,
        textarea: options.remark,
        time: options.useTime.replace(
          /.*(\d{2}:\d{2}):\d{2}.*/g,
          "$1"
        ),
      })
    } else { this.setData({
      type: undefined,
      time: undefined,
      textarea: undefined,
      money: undefined,
      accountId: options.accountId,
    })}
   
    
  },
  bindPickerChange: function (e) {
    this.setData({
      typeIndex: e.detail.value,
    });
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value,
    });
  },
  onTextAreaChange: function (event) {
    this.setData({
      textarea: event.detail.value,
    });
  },
  bindKeyInput: function (event) {
    this.setData({
      money: event.detail.value,
    });
  },
  radioChange: function (event) {
    this.setData({
      type: event.detail.value,
    });
  },

  submit: async function () {
    const current = new Date();
    const date = `${current.getFullYear()}-${current
      .getMonth()
      .toString()
      .padStart(2, 0)}-${current.getDay().toString().padStart(2, 0)}`;
    const type = this.data.type;
    const time = this.data.time || `${current
      .getHours()
      .toString()
      .padStart(2, 0)}-${current.getMinutes().toString().padStart(2, 0)}`;
    const textarea = this.data.textarea;
    const accountId = this.data.accountId;
    const id = this.data.id;
    const money = (this.data.money || 0) * 100;
    const parmas = { id, accountId, type, useTime: `${date} ${time}`, remark: textarea, money };
    console.log(parmas)
    if (!parmas.type) {
      wx.showToast({
        title: '用途不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (parmas.money === 0) {
      wx.showToast({
        title: '花费不能为空，零',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '提交中',
    })
    const res = await request(id ? "/api/expenses/update" : "/api/expenses/add", {
      data: parmas,
    });
    wx.hideLoading()
    const {code, msg} = res.data
    if (code === 200) {
      wx.showToast({title: msg,
        icon: 'success',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    } else {
      wx.showToast({title: msg,
        icon: 'error',
        duration: 2000
      })
    }
  },
});
