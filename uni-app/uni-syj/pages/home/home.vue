<template>
	<view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="data in looplist" :key="data.id">
				<image :src="'http://localhost:3000'+data.url" mode="widthFix"></image>
			</swiper-item>
		</swiper>
		
		<view class="list" v-for="data in datalist" :key="data.id" @click="handleChangePage(data.id)">
			<image :src="'http://localhost:3000'+data.poster" mode="widthFix"></image>
			<view >
				{{data.name}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				looplist:[],
				datalist:[],
				current:1,
				total:0
			}
		},
		//vue生命周期
		mounted() {
			//ajax
			console.log("mounted")
			//uni 在微信中 === wx  baidu ===swan  支付宝===my(蚂蚁) 头条===tt
			uni.request({
				url:"http://localhost:3000/recommends",
				success: (res) => {
					console.log(res.data)
					this.looplist =res.data
				}
			})
			
			uni.request({
				url:"http://localhost:3000/goods?_page=1&_limit=5",
				success: (res) => {
					console.log(res.header)
					this.datalist = res.data
					//如果在H5
					// #ifdef H5
					this.total = res.header["x-total-count"]
					// #endif
					
					
					//如果在小程序
					// #ifndef H5
					this.total = res.header["X-Total-Count"]
					// #endif
					
				}
			})
		},
		//小程序的生命周期
		onLoad() {
			console.log("onLoad")
		},
		
		onReady() {
			console.log("onReady")
		},
		
		methods: {
			handleChangePage(id){
				console.log(id)
				uni.navigateTo({
					url:`/pages/detail/detail?id=${id}`
				})
			}
		}, 
		
		onReachBottom() {
			console.log(this.datalist.length,this.total)
			//字符串与number 转换。
			if(this.datalist.length==this.total){
				return 
			}
			console.log("到底了")
			this.current++;
			uni.request({
				url:`http://localhost:3000/goods?_page=${this.current}&_limit=5`,
				success: (res) => {
					// console.log(res.data)
					this.datalist = [...this.datalist,... res.data]
				}
			})
		},
		onPullDownRefresh() {
			console.log("下拉了")
			setTimeout(()=>{
				uni.stopPullDownRefresh()// wx.stop......
			},2000)
		}
	}
</script>

<style lang="scss" scoped>
swiper-item{
	image{
		width: 100%;
	}
}
swiper{
	height: 300rpx;
}

.list{
	padding: 10rpx;
	overflow: hidden;
	image{
		width:200rpx;
		float:left;
	}
}
</style>
