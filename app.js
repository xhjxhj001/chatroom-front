//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 微信登录
    var that = this;
    wx.login({
        success: function(res) {
            if (res.code) {
                //发起网络请求
                wx.request({
                    url: 'https://www.wanghaishu.com/login',
                    method: 'POST',
                    data: {
                        code: res.code
                    },
                    success: function (ret) {
                        if(ret.data.errno === 0){
                            console.log(ret.data.data);
                            that.globalData.openid = ret.data.data.openid;
                            that.globalData.userInfo = ret.data.data;
                        }
                    }
                })
            } else {
                console.log('登录失败！' + res.errMsg)
            }
        }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: null
  }
})