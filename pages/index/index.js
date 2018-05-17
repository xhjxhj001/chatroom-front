//index.js
//获取应用实例
const app = getApp()
App({
    onLaunch: function () {
        console.log('launch');// 小程序启动之后 触发
        wx.showLoading({
            title: '加载中',
            mask: true

        });
        setTimeout(function(){
            wx.hideLoading()
        },2000)
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

Page({
    data : {
        hasUserInfo: false,
        hasSignUp: false,
        userInfo : null,
        openid : app.globalData.openid,
        signlist: null
    },
    onLoad: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else{
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        }
        var that = this;
        getSignList(that);
    },
    getUserInfo: function (e) {
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
