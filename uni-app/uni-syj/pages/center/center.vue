<template>
	<view>
		<view v-if="!users">
			<!-- 如果判断是H5平台 ，走了登录注册流程 -->
			<!-- #ifdef H5 -->
				<input type="text" placeholder="请输入用户名"/>
				<input type="password" placeholder="请输入密码" />
				<button type="primary" @click="handleLogin">登录</button>
			<!-- #endif -->
			
			<!-- #ifdef MP-WEIXIN -->
				<button type="primary" open-type="getUserInfo" @getuserinfo="handleUserInfo">授权</button>
			<!-- #endif -->
		</view>
		<view class="users" v-else>
			<image :src="users.avatarUrl" @click="handleClick"></image>
			<view>
				{{users.nickName}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				users:null
			};
		},
		mounted() {
			this.users = uni.getStorageSync("users")
		},
		methods:{
			handleUserInfo(ev){
				console.log(ev.detail.rawData)
				this.users = JSON.parse(ev.detail.rawData)
				uni.setStorageSync("isLogin",true)
				uni.setStorageSync("users",this.users)
			},
			handleClick(){
				uni.chooseImage({
					count:1,
					success: (res) => {
						console.log(res.tempFilePaths[0])
						this.users = {
							...this.users,
							avatarUrl:res.tempFilePaths[0]
						}
						uni.setStorageSync("users",this.users)
					}
				})
			},
			// #ifdef H5
			handleLogin(){
				uni.request({
					url:"http://localhost:3000/users",
					success: (res) => {
						console.log(res.data)
						this.users = res.data[0]
						uni.setStorageSync("isLogin",true)
						uni.setStorageSync("users",this.users)
					}
				})
			}
			// #endif
			
		}
	}
</script>

<style lang="scss" scoped>
	.users{
		text-align: center;
		image{
			width: 200rpx;
			height: 200rpx;
			border-radius: 50%;
		}
	}
</style>
