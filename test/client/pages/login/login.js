

Page({
  data: {
    username: '',
    password: ''
  },
  onLoad: function () {

  },
  password: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  username: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  login: function (e) {
    //登录
    var that = this

    wx.request({
      url: 'http://salon.hiter-lab.cn:3000/login',
      method: "POST",
      data: {
        username: that.data.username,
        password: that.data.password
      },
      header: {
        'content-type': 'json'
      },
      success: function (res) {
        that.redirect()
      }
    })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  redirect: function (e) {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
})
