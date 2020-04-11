// pages/shopcar/shopcar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist:[]
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
    console.log("只走一次")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.request({
      url: `http://localhost:3000/carts?_expand=good&username=${wx.getStorageSync('users').nickName}`, //json-server 提供的特殊功能 _expand
      // 联表查询 工作时在后端实现, 我们前端只需要拿到后端提供的接口
      success:(res)=>{
        console.log(res.data)
        this.setData({
          datalist:res.data
        })
      }
    })
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
  // 购物车数量减少
  handleMinus(ev){
    // console.log(ev.currentTarget.dataset.id)
    // 1- 更新data,更新视图
    // 2- 同步"数据库"
    let tmepid = ev.currentTarget.dataset.id //点击id
    let tempobj = null //要更新的对象
    let newlist= this.data.datalist.map(item=>{
      if(item.id===tmepid){
        tempobj = {
          ...item,
          number:item.number-1===0?1:(item.number-1)
        }
        return tempobj
      }
      return item
    })
    // console.log(newlist)
    this.setData({
      datalist:newlist
    })
    this.updateCart(tempobj)
  },
  handleAdd(ev){
    // console.log(ev.currentTarget.dataset.id)
    // 1- 更新data,更新视图
    // 2- 同步"数据库"
    let tmepid = ev.currentTarget.dataset.id //点击id
    let tempobj = null //要更新的对象
    let newlist= this.data.datalist.map(item=>{
      if(item.id===tmepid){
        tempobj = {
          ...item,
          number:item.number+1
        }
        return tempobj
      }
      return item
    })
    // console.log(newlist)
    this.setData({
      datalist:newlist
    })
    this.updateCart(tempobj)
  },

  updateCart(cartobj){
    // cartobj 对象 
    /*
      {
        "goodId": 1,
        "number": 16,
        "username": "饮冰",
        "checked": false,
        "id": 1
      }
    */
    //同步数据库的操作
    //显示loading....
    wx.showLoading({
      title: '同步中',
    })
    let {goodId,number,username,checked} = cartobj
    wx.request({
      url: `http://localhost:3000/carts/${cartobj.id}`,
      method:'put', //
      data:{
        goodId,
        number,
        username,
        checked
      },
      success:()=>{
        //隐藏loadIng.....
        wx.hideLoading()
      }
    })
  },
  handleChange(ev){
    // console.log("handleChange",ev.currentTarget.dataset.id)
    //取反
    let tempid = ev.currentTarget.dataset.id
    let newlist=[...this.data.datalist]

    newlist.forEach(item=>{
      if(item.id===tempid){
        item.checked = !item.checked
        //同步数据库
        this.updateCart(item)
      }
    })

    this.setData({
      datalist:newlist
    })
  },
  //删除
  handleModal(ev){
    // console.log("handleDelete")
    // 弹出对话框,你确认删除吗?
    wx.showModal({
      title: '提示',
      content: '你确认要删除吗?',
      success: (res) => {
        if (res.confirm) {
          // console.log('用户点击确定')
          this.handleDelete(ev.currentTarget.dataset.id)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  handleDelete(id){
    // console.log(id)
    this.setData({
      datalist:this.data.datalist.filter(item=>item.id!==id)
    })

    wx.request({
      url: `http://localhost:3000/carts/${id}`,
      method:"delete",
      success:()=>{
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  handleAllChecked(ev){
    // console.log(ev.detail.value)
    if(ev.detail.value.length===0){
      //全不选 - 当前视图处理， 同步数据库( json-server 没有一个好的方法可以一次性
      // put 修改 多个值， for循环 遍历每个id 进行 更新
      //)
      this.setData({
        datalist:this.data.datalist.map(item=>({
          ...item,
          checked:false
        }))
      })
    }else{
      //全选
      this.setData({
        datalist:this.data.datalist.map(item=>({
          ...item,
          checked:true
        }))
      })
    }

    // this.data.datalist.forEach(item=>{

    // })
  },
  handlePay(){
    //向后端发起ajax请求， 带参数，后端创建订单，此时订单是未支付状态
    //后端向微信服务器发起请求， 带参数， 微信创建订单，返回prePayId到咱们自己后端
    //后端返回prePayId, 签名， 时间戳，随机字符串

    // wx.requestPayment({
    //   timeStamp: '',
    //   nonceStr: '',
    //   package: '',
    //   signType: 'MD5',
    //   paySign: '',
    //   success (res) { },
    //   fail (res) { }
    // })
  }
})