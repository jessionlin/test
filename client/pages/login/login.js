

Page({
  data: {
    
  },
  formSubmit: function (e) {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  } 
})
