// 👇【渲染进程】, 无法使用 Node, 除非在 main.js 这个主进程中设置 webPreferences, 并且需要安装 npm install @electron/remote --save 包
// References: https://blog.csdn.net/baixue0111/article/details/122088933
// const { BrowserWindow } = require('electron')
const BrowserWindow = require("@electron/remote").BrowserWindow;

window.addEventListener('DOMContentLoaded', () => {
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
})