// 👇【渲染进程】, 无法使用 Node, 除非在 main.js 这个主进程中设置 webPreferences, 并且需要安装 npm install @electron/remote --save 包
// References: https://blog.csdn.net/baixue0111/article/details/122088933
// const { BrowserWindow } = require('electron')
const BrowserWindow = require("@electron/remote").BrowserWindow
const currentWindow = require("@electron/remote").getCurrentWindow() // 获取当前的窗口对象 ger Current Window

window.addEventListener('DOMContentLoaded', () => {
	// 👇新建窗口的事件
	const btn1 = document.getElementById('btn-1')
	btn1.addEventListener('click', () => {
		// 🚀 创建一个新窗口
		// alert('msg')
		let indexWindow = new BrowserWindow({
			width: 200,
			height: 200,
		})
		
		indexWindow.loadFile('list.html')

		indexWindow.on('close', () => {
			indexWindow = null
		})
	})


	// 👇右侧窗口 icon 的事件
	let rightBtn = document.querySelectorAll('.windowTool')[0].getElementsByTagName('div')
	let miniSizeBtn = rightBtn[0]
	let maxSizeBtn = rightBtn[1]
	let closeBtn = rightBtn[2]

	miniSizeBtn.addEventListener('click', () => {
		if(!currentWindow.minimize()) {
			currentWindow.minimize() //最小化
		}
	})

	maxSizeBtn.addEventListener('click', () => {
		//如果当前没有最大化, 则调用最大化的方法, 否则回到
		console.log(currentWindow.isMaximized()) // isMaximized 方法
		if(!currentWindow.isMaximized()) { //如果不是最大化
			currentWindow.maximize() //最大化
		} else {
			currentWindow.restore() //取消最大化, 回到最大化之前的样子
		}
	})

	closeBtn.addEventListener('click', () => {
		currentWindow.close() //关闭窗口
	})

})