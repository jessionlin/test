

Page({
  data: {
    username:'',
    password:''
  },
  onLoad: function () {
    
  },
<<<<<<< HEAD
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
=======
  formSubmit: function (e) {
    wx.navigateTo({
      url: '/pages/index/index',
>>>>>>> 9e5b2c646745a2e8b1897df671ebedbe56d8e5c3
    })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  redirect:function(e){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
})
