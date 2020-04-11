<template>
	<view>
		<view v-if="!cartlist.length">
			购物车空空如也
		</view>
		<view v-else>
			<checkbox-group @change="handleChange">
				<label>
					<checkbox value="爱什么值" :checked="isAllChecked()"/><text>全选</text>
				</label>
			</checkbox-group>
			<view v-for="data in cartlist" :key="data.id" class="box" @longpress="handleDeleteConfirm(data.id)">
				<label>
					<checkbox @click="handleChecked(data.id)" :checked="data.checked"/>
				</label>
				
				<image :src="'http://localhost:3000'+data.good.poster"></image>
				<view class="content">
					<view>
						{{data.good.name}}
					</view>
					<view>
						{{data.good.price}}
					</view>
				</view>
				<view class="calculate">
					<text @click="handleMinus(data.id)">-</text>
					<input disabled :value="data.number"/>
					<text @click="handleAdd(data.id)">+</text>
				</view>
			</view>
			<view >
				总金额:{{computedSum}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cartlist:[]
			};
		},
		computed:{
			computedSum(){
				let mysum =0;
				this.cartlist.forEach(item=>{
					if(item.checked){
						mysum+=item.good.price * item.number
					}
				})
				return mysum
			}
		},
		
		onShow() {
			let name = uni.getStorageSync("users").nickName
			uni.request({
				url:`http://localhost:3000/carts?_expand=good&username=${name}`,
				success: (res) => {
					console.log(res.data)
					this.cartlist= res.data//setData??
				}
			})
		},
		methods:{
			handleMinus(id){
				this.cartlist.forEach(item=>{
					if(item.id===id){
						item.number = item.number-1===0?1:(item.number-1)
						this.update(item)
					}
				})	
			},
			handleAdd(id){
				this.cartlist.forEach(item=>{
					if(item.id===id){
						item.number = item.number+1
						this.update(item);
					}
				})	
			},
			handleChecked(id){
				this.cartlist.forEach(item=>{
					if(item.id===id){
						item.checked = !item.checked
						this.update(item);
					}
				})	
			},
			update(obj){
				let {goodId,number,checked,username} = obj
				uni.request({
					url:`http://localhost:3000/carts/${obj.id}`,
					method:"put",
					data:{
						goodId,
						number,
						checked,
						username
					},
					success: () => {
						
					}
				})
			},
			handleDeleteConfirm(id){
				uni.showModal({
					title:"提示",
					content:"确认删除吗?",
					success:(res)=>{
						// console.log(res.confirm)
						if(res.confirm){
							this.cartlist = this.cartlist.filter(item=>item.id!==id)
							this.delete(id)
						}
					}
				})
			},
			delete(id){
				uni.request({
					url:`http://localhost:3000/carts/${id}`,
					method:"delete",
					success: () => {
						
					}
				})
			},
			handleChange(ev){
				console.log(ev.detail.value)
				if(ev.detail.value.length>0){
					//勾上
					this.cartlist.forEach(item=>{
						item.checked = true
					})
				}else{
					//未勾上
					this.cartlist.forEach(item=>{
						item.checked = false
					})
				}
			},
			isAllChecked(){
				if(this.cartlist.length===0){
					return false	
				}
				return this.cartlist.every(item=>item.checked)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box{
		display: flex;
		padding: 10rpx;
		image{
			width: 200rpx;
			height: 200rpx;
		}
		.content{
			width: 200rpx;
		}
		.calculate{
			display: flex;
			input{
				width: 200rpx;
				text-align: center;
			}
		}
	}
</style>
