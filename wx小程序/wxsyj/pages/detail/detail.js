// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodInfo:{}
  },
  myid:0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(Number(options.id))
    // id 默认预留属性,不动他
    this.myid = Number(options.id) //id存起来, 要里利用id发ajax获取详情页面数据
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(this.myid)
    wx.request({
      url: `http://localhost:3000/goods/${this.myid}`,
      success:(res)=>{
        console.log(res.data)
        this.setData({
          goodInfo:res.data
        })
      }
    })
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

  handleAddCart(){
    //判断是否登录,如果登录成功,跳转购物车页面;如果登录失败,跳转到center页面,
    //没有localStorage localStorage.getItem , setItem ,removeItem,clear
    // wx.setStorageSync('key', data) 设置 ,可以直接存对象,bool
    // wx.getStorageSync('key') 获取
    // wx.removeStorageSync('key') 删除
    // wx.clearStorageSync() //清空
    if(wx.getStorageSync('isLogin') === true){
       // 0. 先取出此商品是否存过,
       // 1. 如果存过,put更新数据,让数据number++
       // 2. 如果没有存过, post新数据存储
      wx.request({
        url: `http://localhost:3000/carts?goodId=${this.data.goodInfo.id}`,
        success:(res)=>{
          if(res.data.length===0){
            console.log("post添加新的商品")
            this.addCart()
          }else{
            console.log("put更新商品")
            this.updateCart(res.data[0])// 更新函数,接受参数 
          }
        }
      })
    }else{
      //往选项卡跳转页面
      wx.switchTab({
        url: '/pages/center/center',
      })
    }
  },

  updateCart(cartobj){
    wx.request({
      url: `http://localhost:3000/carts/${cartobj.id}`,
      method:"put" ,//更新,
      data:{
        ...cartobj,
        number:cartobj.number+1
      },
      success:()=>{
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  addCart(){
    wx.request({
      url: 'http://localhost:3000/carts',
      data:{
         goodId:this.data.goodInfo.id, //商品的id,
         number:1,
         username:wx.getStorageSync('users').nickName,
         checked:false //是否选中
      },
      method:"post", //json-server 添加一条新数据
      success:(res)=>{
        console.log(res.data)
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      }
     })
  },

  handleChangeCart(){
    wx.switchTab({
      url: '/pages/shopcar/shopcar',
    })
  },
  //预览界面
  handlePreview(ev){
    // console.log(ev.currentTarget.dataset.url)
    wx.previewImage({
      current: ev.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.goodInfo.slides.map(item=>"http://localhost:3000"+item) // 需要预览的图片http链接列表
    })
    
  }
})