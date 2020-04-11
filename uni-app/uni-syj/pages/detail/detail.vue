<template>
	<view>
		<swiper :circular="true">
			<swiper-item v-for="data in detailInfo.slides" :key="data">
				<image :src="'http://localhost:3000'+data" mode="widthFix" @click="handlePreview(data)"></image>
			</swiper-item>
			
		</swiper>
		<view>
			{{detailInfo.name}}
		</view>
		<view>
			{{detailInfo.price}}
		</view>
		<button @click="handleAddCart">加入购物车</button>
		<button type="primary" @click="handleChange">跳转购物车</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:0,
				detailInfo:{}
			}
		},
		
		onLoad(options) {
			// console.log(options.id)
			this.id = options.id
		},
		
		onReady() {
			// console.log(this.id)
			uni.request({
				url:`http://localhost:3000/goods/${this.id}`,
				success: (res) => {
					console.log(res.data)
					this.detailInfo = res.data
				}
			})
		},
		
		methods: {
			handleChange(){
				uni.switchTab({
					url:'/pages/shopcar/shopcar'
				})
			},
			handlePreview(current){
				uni.previewImage({
					current:'http://localhost:3000'+current,
					urls:this.detailInfo.slides.map(item=>'http://localhost:3000'+item)
				})
			},
			handleAddCart(){
				if(uni.getStorageSync("isLogin")){
					//post添加元素
					uni.request({
						url:`http://localhost:3000/carts?goodId=${this.detailInfo.id}`,
						success: (res) => {
							res.data.length===0?this.add():this.update(res.data[0])
						}
					})
				}else{
					uni.switchTab({
						url:'/pages/center/center'
					})
				}
			},
			add(){
				uni.request({
					url:'http://localhost:3000/carts',
					method:"post",
					data:{
						goodId:this.detailInfo.id,
						number:1,
						checked:false,
						username:uni.getStorageSync("users").nickName
					},
					success: () => {
						
					}
				})
			},
			update(obj){
				uni.request({
					url:`http://localhost:3000/carts/${obj.id}`,
					method:"put",
					data:{
						goodId:obj.goodId,
						number:obj.number+1,
						checked:obj.checked,
						username:obj.username
					},
					success: () => {
						
					}
				})
			}
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
		height: 750rpx;
	}
</style>
