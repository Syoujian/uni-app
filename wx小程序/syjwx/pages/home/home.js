// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    looplist:[], //都是跟视图相关
    datalist:[],
    isHidden:true
  },
  kerwincurrent:1,
  kerwinTotal:0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(window,document) // 小程序没有window对象和 document,
    // 一切基于dom操作的库,在小程序中无法使用
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //ajax ==>  $.ajax
    /*
    // 后端接口已经上线
      1. 小程序没有跨域限制
      2. 为了用户安全，需要将自己的后台接口加入了白名单
      3. 后台接口必须是https协议的接口 （猫眼数据）

    // mock服务器情况  
      1. 如果在开发阶段,后端接口未开发完成,我们可以开启小程序不校验域名这个功能
    */
    // wx.request({
    //   url: 'https://m.maoyan.com/ajax/mostExpected?ci=10&limit=10&offset=0&token=&optimus_uuid=43388C403C4911EABDC9998C784A573A4F64A16AA5A34184BADE807E506D749E&optimus_risk_level=71&optimus_code=10',
    //   // data:{

    //   // },
    //   success:(res)=>{
    //     console.log(res.data) //res.data 后端真正返回的数据
    //   }
    // })

    wx.request({
      url: 'http://localhost:3000/recommends',
      success:(res)=>{
        console.log(res.data)
        this.setData({
          looplist:res.data
        })
      }
    })

    //请求商品列表的数据
    wx.request({
      url: 'http://localhost:3000/goods?_page=1&_limit=5',
      success:(res)=>{
        // console.log(res.header["X-Total-Count"])
        this.kerwinTotal = res.header["X-Total-Count"] //总数据长度
        this.setData({
          datalist:res.data
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
    console.log("下拉了","请求数据")
    //模拟ajax,
    setTimeout(()=>{
      //主动调用方法, 让下拉框回去
      wx.stopPullDownRefresh()
    },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.datalist.length >= this.kerwinTotal) {
      //所有的数据已经请求结束
      this.setData({
        isHidden:false
      })

      return;
    }
    this.kerwincurrent++
    console.log("到底了",this.kerwincurrent)
    wx.request({
      url: `http://localhost:3000/goods?_page=${this.kerwincurrent}&_limit=5`,
      success:(res)=>{
        // console.log(res.data)
        this.setData({
          datalist:[...this.data.datalist,...res.data] // 不能直接赋值, 应该是合并操作,
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //点完列表,跳转详情页面
  handleChangePage(ev){
    // console.log(ev.currentTarget.dataset.kerwinid)
    //带着id跳转页面
    //navigateTo :保留当前页面, 跳转到新的页面
    //redirectTo: 关闭当前页面 ,跳转到新的页面
    //navigateBack: 回到上一个页面
    //switchTab: 选项卡切换
    wx.navigateTo({
      url: `/pages/detail/detail?id=${ev.currentTarget.dataset.kerwinid}`, // 动态路由???
    }) //底部选项卡没有是正常的
  }
})