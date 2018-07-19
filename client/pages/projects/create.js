// pages/projects/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    number_index: 0,
    project_name: '',
    project_describe: '',
    group_number: 0,
    group_number_now: 0,
    group_describe: '',
    images: []
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '添加项目',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getProjectName: function(e) {
    this.setData({
      project_name: e.detail.value
    });
  },
  getProjectDescribe: function(e) {
    this.setData({
      project_describe: e.detail.value
    });
  }, 
  getPredictNumber: function(e) {
    console.log(e.detail.value);
    this.setData({
      group_number: e.detail.value
    });
  },
  getHaveNumber: function(e) {
    this.setData({
      group_number_now: e.detail.value
    });
  },
  getGroupDescribe: function(e) {
    this.setData({
      group_describe: e.detail.value
    });
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          images: that.data.images.concat(res.tempFilePaths)
        });
      }
    });
  },
  submit: function(e) {
    wx.request({
      url: "/project",
      method: "POST",
      success: function(res) {
        var data = res.data;
        if ( data.success ) {
          wx.showToast({
            title: '创建项目成功',
            icon: "success",
            duration: 3000
          });
        } else {
          wx.showToast({
            title: data.err,
            icon: 'warn',
            image: '../images/danger.png',
            duration: 3000
          });
        }
      },
      fail: function(e) {
        wx.showToast({
          title: '创建项目失败 ',
          icon: 'warn',
          image: '../images/danger.png',
          duration: 3000
        });
      }
    });
  }
})