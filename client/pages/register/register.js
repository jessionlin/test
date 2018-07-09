
Page({
  data: {
    percent:25,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    collegeArray: ['哈尔滨工业大学', '哈尔滨工程大学', '哈尔滨理工大学', '黑龙江大学'],
    collegeIndex: 0,
    facultyArray: ['计算机类', '软件工程', '物流管理', '飞行器设计', '物理光学'],
    facultyIndex: 0,

  },
  onLoad:function(){

  },
  chooseCollege: function (e) {
    this.setData({
      collegeIndex: e.detail.value
    })
  },
  chooseFaculty: function (e) {
    this.setData({
      facultyIndex: e.detail.value
    })
  },
})
