//index.js
//获取应用实例
const app = getApp()
App({
    onLaunch: function () {
        console.log('launch');// 小程序启动之后 触发       
    }
})

/**
 * 获取签到列表
 * @param that
 */
function getSignList (that) {
    wx.request({
        method: 'GET',
        url: 'https://www.wanghaishu.com/signlist',
        success: function (res) {
            if(res.data.errno === 0){
                that.setData({
                    signlist: res.data.data
                })
            }else{
                alert(res.data.errmsg);
            }
        }
    })
}

/**
 * 获取用户信息
 */
function getUser(that) {
  wx.login({
    success: function (res) {
      if (res.code) {
        //发起网络请求
        wx.request({
          url: 'https://www.wanghaishu.com/user',
          method: 'GET',
          data: {
            code: res.code
          },
          success: function (ret) {
            if (ret.data.errno === 0) {
              console.log(ret.data.data);
              app.globalData.userInfo = ret.data.data;
              app.globalData.openid = ret.data.data.openid;
              that.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
              });
            }
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}

Page({
    data : {
        hasUserInfo: false,
        hasSignUp: false,
        userInfo: app.globalData.userInfo,
        openid : app.globalData.openid,
        signlist: null
    },
    onLoad: function() {
        var that = this;
        getUser(that);
        wx.showLoading({
          title: '加载中',
          mask: true

        });
        setTimeout(function () {
          wx.hideLoading();
        }, 2000);

        getSignList(that);
    },
    getUserInfo: function (e) {
        var that = this;
        console.log(e);
        wx.login({
            success: function(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://www.wanghaishu.com/login',
                        method: 'POST',
                        data: {
                            name: e.detail.userInfo.nickName,
                            avatar: e.detail.userInfo.avatarUrl,
                            code: res.code
                        },
                        success: function (ret) {
                            console.log(ret.data.data.openid);
                            app.globalData.openid = ret.data.data.openid;
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    },
    signUp: function () {
        var that = this;
        wx.request({
            method: 'POST',
            url: 'https://www.wanghaishu.com/signup',
            data: {
                openid: app.globalData.openid
            },
            success: function (res) {
                if(res.data.errno === 0){
                    getSignList(that);
                    wx.showToast({
                        title: '报名成功',
                        icon: 'success',
                        duration: 1000,
                        mask:true
                    })
                    that.setData({
                        hasSignUp: true
                    })
                }else if(res.data.errno === 880332){
                    wx.showToast({
                        title: '报名失败:' + res.data.errmsg,
                        icon: 'none',
                        duration: 1000,
                        mask:true
                    })
                    that.setData({
                        hasSignUp: true
                    })
                }else{
                    wx.showToast({
                        title: '报名失败:' + res.data.errmsg,
                        icon: 'none',
                        duration: 1000,
                        mask:true
                    })
                }
            }
        })
    }
});
