// pages/demo/demo.js
// 每个页面 必须 Page() 注册页面 ，页面生命周期
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mytext:"",
    list:["11111","22222","33333"],
    item: "default-item",
    current:0,
    isCreated:true,
    isShow:true
  },
  //定义一个事件处理函数
  handleKerwinTap(){
    // console.log("aaaaa")
    
    this.setData({
      mytext:"22222222"
    })
  },

  handleInput(ev){
    // console.log(ev.detail.value)
    this.setData({
      mytext:ev.detail.value
    })
  },
  // add 点击处理函数
  handleAdd(){
    // console.log(this.data.mytext) //

    this.setData({
      mytext:"", //清空输入框
      list:[...this.data.list,this.data.mytext]
    })
  },

  // 删除按钮事件
  handleDelTap(ev){
    console.log("del",ev.target.dataset.index)
    var newlist= [...this.data.list]
    newlist.splice(ev.target.dataset.index,1)
    this.setData({
      list:newlist
    })
  },

  // 点击变色处理
  handleChangeTap(ev){
    //ev.target 事件源
    //ev.currentTarget 绑定事件的dom节点
    console.log(ev.currentTarget.dataset.aaa)
    this.setData({
      current:ev.currentTarget.dataset.aaa
    })
  },

  handleCreted(){
    this.setData({
      isCreated:!this.data.isCreated,
      isShow:!this.data.isShow
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //ajax??? 有没有跨域限制？
    // wx.request({
    //   url: 'url',
    // })
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

  }
})