
Page({
  data: {
    percent:25,
   
    //学校名称与选中条目index
    collegeArray: ['哈尔滨工业大学', '哈尔滨工程大学', '哈尔滨理工大学', '黑龙江大学'],
    collegeIndex: 0,
   
    //专业名称与选中条目index
    facultyArray: ['计算机类', '软件工程', '物流管理', '飞行器设计', '物理光学'],
    facultyIndex: 0,
    
    //注册界面picker位置
    currentItemId:1,

    //注册填写表项 学校选中ID与学院选中ID在上面已经定义
    userName: "",
    password: "",
    realName: "",
    phone: "",
    email: "",
    characteristic: "",

    //错误判断
    ifNext:false,//用于第一步判断，判断两次输入密码是否相等
    falseMsg:"",
    usernameErrorDisplay:"none",
    realnameErrorDisplay: "none",
    passwordErrorDisplay:"none",
    charLengthErrorDisplay:"none"
  },
  onLoad:function(){
    //初始化学校
    // wx.request({
    //   url: '/data/school',
    //   method: "GET",
    //   header: {
    //     'content-type': 'json' 
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })
  },

  /*
  注册信息写入系统变量中，
  */
  username:function(e){
    this.setData({
      userName: e.detail.value,
    })
    console.log(this.data.userName)
    // wx.request({
    //   url: '/useful_name', 
    //   data: {
    //     user_name: this.data.userName,
    //   },
    //   method:"POST",
    //   header: {
    //     'content-type': 'json'
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })
  },
  password: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  realname: function (e) {
    this.setData({
      realName: e.detail.value
    })
  },
  checkPassword: function (e) {
    console.log(e.detail.value)
    if (e.detail.value !== this.data.password){
      this.setData({
        ifNext: false,
        falseMsg :"两次密码不一致",
        passwordErrorDisplay:"block"
      })
    }
    else{
      this.setData({
        ifNext: true,
        falseMsg: "",
        passwordErrorDisplay: "none"
      })
    }
  },
  chooseCollege: function (e) {
    this.setData({
      collegeIndex: e.detail.value
    })
    console.log(this.data.collegeIndex)
  },
  chooseFaculty: function (e) {
    this.setData({
      facultyIndex: e.detail.value
    })
  },
  characteristic:function(e){
    //字数判断
    if(e.detail.value.length > 100){
      this.setData({
        charLengthErrorDisplay: "block",
        falseMsg: "最多输入100个字符"
      })
    }
    else{
      this.setData({
        characteristic: e.detail.value,
        charLengthErrorDisplay: "none",
        falseMsg: ""
      })
    }
    console.log(this.data.characteristic)
  },
  phone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  email:function(e){
    this.setData({
      email: e.detail.value
    })
  },
  next:function(e){
    console.log("进入了下一步活动")
    var index = 0;
    var check = this.data.ifNext;
    console.log(check)
    if (!this.data.userName || !this.data.realName || !this.data.password) {

      if (!this.data.userName) {
        this.setData({
          usernameErrorDisplay: "block",
          falseMsg: "请输入用户名",
          ifNext: false,
        })
        index = 1
      }
      else {
        this.setData({
          usernameErrorDisplay: "none",
        })
      }

      if (index == 0 && !this.data.realName) {
        this.setData({
          realnameErrorDisplay: "block",
          falseMsg: "请输入真实姓名",
          ifNext: false,
        })
        index = 1
      }
      else {
        this.setData({
          realnameErrorDisplay: "none",
        })
      }
      if (index == 0 && !this.data.password) {
        this.setData({
          passwordErrorDisplay: "block",
          falseMsg: "请输入密码",
          ifNext: false,
        })
        index = 1
      }
      else {
        this.setData({
          passwordErrorDisplay: "none",
        })
      }
    }
    if (this.data.userName && this.data.realName && this.data.password) {
      this.setData({
        falseMsg: "",
        ifNext: true
      })
    }
    if (this.data.ifNext && check){
      if (this.data.currentItemId == 1 && this.data.ifNext) {
        this.setData({
          currentItemId: this.data.currentItemId + 1
        })
      }
      else if (this.data.currentItemId > 1) {
        this.setData({
          currentItemId: this.data.currentItemId + 1
        })
      }
    }
    else if(this.data.ifNext && !check){
      this.setData({
        ifNext: false,
        falseMsg: "两次密码不一致",
        passwordErrorDisplay: "block",
        usernameErrorDisplay: "none",
        realnameErrorDisplay: "none",
      })
    }
  },
  prev:function(){
    this.setData({
      currentItemId: this.data.currentItemId - 1
    })
  },

  //注册
  register:function(){
    console.log(this.data.userName)
    console.log(this.data.password)
    console.log(this.data.realName)
    console.log(this.data.collegeIndex)
    console.log(this.data.facultyIndex)
    console.log(this.data.phone)
    console.log(this.data.email)
    console.log(this.data.characteristic)
    // wx.request({
    //   url: '/register', 
    //   data: {
    //     user_name: this.data.userName,
    //     password: this.data.password,
    //     real_name: this.data.realName,
    //     school_id: this.data.collegeIndex,
    //     profession_id: this.data.facultyIndex,
    //     phone: this.data.phone,
    //     email: this.data.email,
    //     characteristic: this.data.characteristic,
    //   },
    //   header: {
    //     'content-type': 'application/json' 
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })
  }
})
