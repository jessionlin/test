
Page({
  data: {
    percent:25,
   
    //学校名称与选中条目index
    collegeArray: [],
    collegeArrayId:[],
    collegeIndex: 0,
   
    //专业名称与选中条目index
    facultyArray: [],
    facultyArrayId: [],
    facultyIndex: 0,

    //特长选择备选默认与颜色列表
    labelBgColor: ["white", "#FFF5EE", "#FFE4B5", "#F0FFFF", "#00FA9A", "#D8BFD8", "#F0E68C", "#B0C4DE", "#40E0D0", "#FFC0CB", "#FFFFE0", "#F5DEB3"],
    labelItems: [],
    labelItemsId: [],
    labelSelected: [],
    
    //注册界面picker位置
    currentItemId:1,

    //注册填写表项 学校选中ID与学院选中ID在上面已经定义
    userName: "",
    password: "",
    realName: "",
    phone: "",
    email: "",
    characteristic: [],


    //错误判断
    ifNext:false,//用于第一步判断，判断两次输入密码是否相等
    falseMsg:"",
    usernameErrorDisplay:"none",
    realnameErrorDisplay: "none",
    passwordErrorDisplay:"none",
    chLengthErrorDisplay:"none"
  },
  onLoad:function(){
    var that = this
    //初始化学校
    wx.request({
      url: 'http://salon.hiter-lab.cn:3000/data/school',
      method: "GET",
      header: {
        'content-type': 'json'
      },
      success: function (res) {
        // console.log(res.data.data)
        // console.log(that)
        // console.log(that.getItemFromObjArr(res.data.data, "school_name"))
        that.setData({
          collegeArray: that.getItemFromObjArr(res.data.data, "school_name"),
          collegeArrayId: that.getItemFromObjArr(res.data.data, "id")
        })
        // console.log(that.data.collegeArray)
      }
    })
    //初始化专业
    wx.request({
      url: 'http://salon.hiter-lab.cn:3000/data/profession',
      method: "GET",
      header: {
        'content-type': 'json'
      },
      success: function (res) {
        // console.log(res.data.data)
        // console.log(that)
        // console.log(that.getItemFromObjArr(res.data.data, "school_name"))
        that.setData({
          facultyArray: that.getItemFromObjArr(res.data.data, "profession_name"),
          facultyArrayId: that.getItemFromObjArr(res.data.data, "id"),
        })
        // console.log(that.data.facultyArray)
      }
    })
    //初始化特长标签
    wx.request({
      url: 'http://salon.hiter-lab.cn:3000/data/characteristic',
      method: "GET",
      header: {
        'content-type': 'json'
      },
      success: function (res) {
        // console.log(res.data.data)
        // console.log(that)
        // console.log(that.getItemFromObjArr(res.data.data, "school_name"))
        that.setData({
          labelItems: that.getItemFromObjArr(res.data.data, "characteristic_name"),
          labelItemsId: that.getItemFromObjArr(res.data.data, "id"),
        })
        console.log(that.data.labelItems)
        let labels = that.data.labelItems;
        let ids = that.data.labelItemsId
        let bgcLength = that.data.labelBgColor.length
        let items = []
        for (let i = 0; i < labels.length; i++) {
          let item = { id: 0, name: "", bgcolor: "white" };
          item.id = ids[i];
          item.name = labels[i];
          //按顺序赋予颜色
          // item.bgcolor = this.data.labelBgColor[i % bgcLength];
          //随机数选择颜色
          item.bgcolor = that.data.labelBgColor[Math.ceil(Math.random() * bgcLength)];
          items.push(item);
        }

        that.setData({
          labelItems: items,
        })
      }
    })
    // let labels = this.data.labelItems;
    // console.log("labelItems: "+ this.data.labelItems)
    // let bgcLength = this.data.labelBgColor.length
    // let items = []
    // for (let i = 0; i < labels.length; i++) {
    //   let item = { id: 0, name: "", bgcolor: "white" };
    //   item.id = 100 + 10 * i;
    //   item.name = labels[i];
    //   //按顺序赋予颜色
    //   // item.bgcolor = this.data.labelBgColor[i % bgcLength];
    //   //随机数选择颜色
    //   item.bgcolor = this.data.labelBgColor[Math.ceil(Math.random() * bgcLength)];
    //   items.push(item);
    // }

    // this.setData({
    //   labelItems: items,
    // })
  },
  //禁止手动滑动swiper
  disallowed:function(){
    return false;
  },

  /*
  注册信息写入系统变量中，
  */
  username:function(e){
    // this.setData({
    //   userName: e.detail.value,
    // })
    var userName = e.detail.value
    var that = this
    console.log(userName)
    // console.log(this.data.userName)
    wx.request({
      url: 'http://salon.hiter-lab.cn:3000/useful_name', 
      method: "POST",
      data: {
        user_name: userName,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if(!res.data.success){
          that.setData({
            usernameErrorDisplay:"block",
            falseMsg:res.data.err
          })
        }
        else{
          that.setData({
            userName: e.detail.value,
            usernameErrorDisplay: "none",
            falseMsg: ""
          })
        }
      }
    })
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
    // console.log(e.detail.value)
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
    // console.log(this.data.collegeIndex)
  },
  chooseFaculty: function (e) {
    this.setData({
      facultyIndex: e.detail.value
    })
  },
  //后期可能会删除
  // characteristic:function(e){
  //   //字数判断
  //   if(e.detail.value.length > 100){
  //     this.setData({
  //       chLengthErrorDisplay: "block",
  //       falseMsg: "最多输入100个字符"
  //     })
  //   }
  //   else{
  //     this.setData({
  //       characteristic: e.detail.value,
  //       chLengthErrorDisplay: "none",
  //       falseMsg: ""
  //     })
  //   }
  //   console.log(this.data.characteristic)
  // },
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
    // console.log("进入了下一步活动")
    var index = 0;
    var check = this.data.ifNext;
    // console.log(check)
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
  //从备选中选择一个标签
  selected: function (e) {
    let id = e.target.id.split("_")[0];
    let name = e.target.id.split("_")[1];
    // console.log(id);
    // console.log(this.getItemNameById(id, this.data.labelItems))
    let labelSelected = this.data.labelSelected;
    if (labelSelected.length < 5) {
      if (!this.checkArrHasId(parseInt(id), labelSelected)){
        labelSelected.push({ id: parseInt(id), name: name })
      }
      this.setData({
        labelSelected: labelSelected,
        chLengthErrorDisplay: "none"
      })
      this.delArrById(id, this.data.labelItems, "labelItems")
    }
    else {
      this.setData({
        falseMsg: "最多选择五个特长标签",
        chLengthErrorDisplay: "block"
      })
    }
    this.getIdArrByObjArr(this.data.labelSelected, "characteristic")
  },
  //取消选择标签
  delSelected: function (e) {
    let id = e.target.id.split("_")[0];
    let name = e.target.id.split("_")[1];
    let labelItems = this.data.labelItems;
    if (!this.checkArrHasId(parseInt(id), labelItems)) {
      labelItems.push({ id: parseInt(id), name: name, bgcolor: this.data.labelBgColor[Math.ceil(Math.random() * this.data.labelBgColor.length)] })
    }
    this.setData({
      labelItems: labelItems,
      falseMsg: "",
      chLengthErrorDisplay: "none"
    })
    this.delArrById(id, this.data.labelSelected, "labelSelected")
  },
  //根据ID选择获取名称
  getItemNameById: function (id, arr) {
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i].id == id) {
        return arr[i].name;
      }
    }
    return null;
  },
  //根据ID删除某一个标签
  delArrById: function (id, arr, arrName) {
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i].id == id) {
        arr.splice(i, 1);
        if (arrName == "labelItems") {
          this.setData({
            labelItems: arr
          })
        }
        else if (arrName == "labelSelected") {
          this.setData({
            labelSelected: arr
          })
        }
        return true;
      }
    }
    return false;
  },
  //重复性检测 如果存在ID，则返回true，否则返回false
  checkArrHasId:function(id,arr){
      for(let i = 0 ; i < arr.length ; i++){
         if(arr[i].id == id){
           return true;
         }
      }
    return false;
  },
  //将对象数组转化为ID数组 传入数据 两个参数，第一个为对象数组，第二个是ID数组的数组名
  getIdArrByObjArr:function(objArr,idArrName){
    let arr = [];
    for(let i = 0 ; i < objArr.length ; i++){
      arr.push(objArr[i].id);
    }
    if (idArrName == "characteristic"){
      this.setData({
        characteristic:arr
      })
    }

    console.log(this.data.characteristic)
  },
  //注册
  register:function(){
    // console.log(this.data.userName)
    // console.log(this.data.password)
    // console.log(this.data.realName)
    // console.log(this.data.collegeIndex + 1)
    // console.log(this.data.facultyIndex + 1)
    // console.log(this.data.phone)
    // console.log(this.data.email)
    // console.log(this.data.characteristic)
    var that = this
    wx.request({
      url: 'http://salon.hiter-lab.cn:3000/register', 
      data: {
        user_name: this.data.userName,
        password: this.data.password,
        real_name: this.data.realName,
        school_id: this.data.collegeIndex +1,
        profession_id: this.data.facultyIndex +1,
        phone: this.data.phone,
        email: this.data.email,
        characteristic: this.data.characteristic,
      },
      method: "POST",
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        // console.log(res.data)
        wx.request({
          url: 'http://salon.hiter-lab.cn:3000/login',
          method: "POST",
          data:{
            username: that.data.userName,
            password: that.data.password,
          },
          header: {
            'content-type': 'json'
          },
          success: function (res) {
            console.log(that)
            that.formSubmit()
          }
        })
      }
    })
  },
  getItemFromObjArr: function (arr, key) {
    var retArr = []
    for (let i = 0; i < arr.length; i++) {
      retArr.push(arr[i][key])
    }
    return retArr
  },
  formSubmit: function (e) {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
})
