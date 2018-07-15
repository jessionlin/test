//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        labelBgColor: ["white", "#FFF5EE", "#FFE4B5", "#F0FFFF", "#00FA9A", "#D8BFD8", "#F0E68C", "#B0C4DE", "#40E0D0", "#FFC0CB", "#FFFFE0", "#F5DEB3"],
        labelItems: ["项目管理", "大数据存储", "数据挖掘", "NLP", "CV", "单片机", "机器翻译", "神经网络", "SVM", "飞行器", "能源", "材料","UI设计"],
        labelSelected: []
    },
    onLoad:function(){
      let labels = this.data.labelItems;
      let bgcLength = this.data.labelBgColor.length
      let items = []
      for (let i = 0; i < labels.length ; i++){
          let item = { id: 0, name: "", bgcolor: "white" };
          item.id = 100 + 10 * i ;
          item.name = labels[i];
          //按顺序赋予颜色
          // item.bgcolor = this.data.labelBgColor[i % bgcLength];
          //随机数选择颜色
          item.bgcolor = this.data.labelBgColor[Math.ceil(Math.random() * bgcLength)];
          items.push(item);
      }

      this.setData({
        labelItems: items,
      })
      // console.log(this.data.labelItems)
    },
    selected:function(e){
      let id = e.target.id.split("_")[0];
      let name = e.target.id.split("_")[1];
      // console.log(id);
      console.log(this.getItemNameById(id, this.data.labelItems))
      let labelSelected = this.data.labelSelected;
      labelSelected.push({ id: parseInt(id), name: name })
      this.setData({
        labelSelected: labelSelected
      })
      this.delArrById(id, this.data.labelItems,"labelItems")
    },
    delSelected:function(e){
      let id = e.target.id.split("_")[0];
      let name = e.target.id.split("_")[1];
      console.log(id);
      let labelItems = this.data.labelItems;
      labelItems.push({ id: parseInt(id), name: name, bgcolor: this.data.labelBgColor[Math.ceil(Math.random() *  this.data.labelBgColor.length)]})
      this.setData({
        labelItems: labelItems
      })
      this.delArrById(id, this.data.labelSelected, "labelSelected")
      // console.log(this.data.labelItems)
      // console.log(this.data.labelSelected)
    },
    getItemNameById:function(id,arr){
      for (let i = 0; i < arr.length ; ++i){
          if (arr[i].id == id){
            return arr[i].name;
          }
        }
      return null;
    },
    delArrById:function(id,arr,arrName){
      console.log(id)
      console.log(arr)
      for (let i = 0; i < arr.length; ++i) {
        if (arr[i].id == id) {
          arr.splice(i, 1);
          console.log("arr")
          console.log(arr);
          if (arrName == "labelItems"){
            this.setData({
              labelItems: arr
            })
          }
          else if (arrName == "labelSelected"){
            this.setData({
              labelSelected: arr
            })
          }
          return true;
        }
      }
      return false;
    }
})

/*
已选和备选的切换部分已经完成，下一步进行的是以下几点：
1. 我的特长可选数量限定
2. 两个数组重复性检测，使用一个函数即可
3. 对于一些错误进行提示
*/