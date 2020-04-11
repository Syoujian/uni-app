<template>
	<view class="box">
		<view class="child">{{myname}}</view>
		<button type="primary" @click="handleClick">click</button>
		<input type="text" v-model="mytext" />
		<button @tap="handleAdd">add</button>
		<view v-for="(data,index) in list" :key="data">
			{{data}}
			<button type="primary" size="mini" @tap="handleDel(index)">del</button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				myname:"kerwin",
				mytext:"",
				list:["111111","22222","333333"]
			}
		},
		mounted(){
			console.log("组件已经挂载")
		},
		methods:{
			handleClick(){
				console.log("11111")
				this.myname = "xiaoming"
			},
			handleAdd(){
				console.log(this.mytext)
				this.list.push(this.mytext)
				this.mytext = "" //清空
			},
			handleDel(index){
				this.list.splice(index,1)
			}
		}
	}
</script>

<style scoped lang="scss">
	.box{
		.child{
			background-color: yellow;
		}
	}
</style>
