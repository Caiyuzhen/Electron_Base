// 👇【渲染进程】, 无法使用 Node, 除非在 main.js 这个主进程中设置 webPreferences, 并且需要安装 npm install @electron/remote --save 包
// References: https://blog.csdn.net/baixue0111/article/details/122088933
// const { BrowserWindow } = require('electron')
const BrowserWindow = require("@electron/remote").BrowserWindow
const currentWindow = require("@electron/remote").getCurrentWindow() // 获取当前的窗口对象 ger Current Window
const { MenuItem, Menu } = require("@electron/remote")


// 加载完毕后执行
window.addEventListener('DOMContentLoaded', () => {
	// 👇关闭窗口前的提醒
	window.onbeforeunload = () => {
		console.log('11')
		const dialog = document.querySelector('.isClose')
		const yesBtn = document.querySelector('.btn-1')
		const noBtn = document.querySelector('.btn-2')

		dialog.style.display = 'block'

		yesBtn.addEventListener('click', () => {
			currentWindow.destroy() //👈避免 close() 死循环
		})

		noBtn.addEventListener('click', () => {
			dialog.style.display = 'none'
		})

		return false
	}



	// 👇新建窗口的事件
	const btn1 = document.getElementById('btn-1')
	btn1.addEventListener('click', () => {
		// 🚀 创建一个新窗口
		// alert('msg')
		let indexWindow = new BrowserWindow({
			parent: currentWindow, //👈设置父窗口为谁 (如果有父子关系的话, 则会拖动时会跟随移动)
			// modal: true, //需要有父子关系才能设置为 模态弹窗！ 会禁用底部的操作
			width: 200,
			height: 200,
		})
		
		indexWindow.loadFile('sub.html')

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
		console.log('是否最大化:', currentWindow.isMaximized()) // isMaximized 方法
		if(!currentWindow.isMaximized()) { //如果不是最大化
			currentWindow.maximize() //最大化
		} else {
			currentWindow.unmaximize() //取消最大化, 回到最大化之前的样子
			// currentWindow.restore() 
		}
	})

	closeBtn.addEventListener('click', () => {
		currentWindow.close() //关闭窗口
	})



	// 👇输入框事件（自定义菜单）
	let customBtn = document.querySelector('.custom-menu')
	let content = document.querySelector('#menuCon')
	let addBtn = document.querySelector('.add-menu')



	// 👇替换为自己的菜单
	customBtn.addEventListener('click', () => {
		// 创建 menu 菜单
		let menuA = new MenuItem({label: 'AAA', type: 'normal'})
		let customMenu2 = new MenuItem({label: '自定义菜单', type: 'submenu', submenu: [{ label: '重载', role: 'reload' },{ label: '重做', role:'redo' },]})
		let customMenu3 = new MenuItem({label: '自定义菜单', type: 'submenu', submenu: [{ label: '取消', role: 'undo' },{ label: '剪切', role:'cut' },]})
	
		let menu = new Menu()
		menu.append(menuA)
		menu.append(customMenu2)
		menu.append(customMenu3)

		Menu.setApplicationMenu(menu) //👈挂载菜单
	})


	// 👇动态的添加菜单项
	let menuItem = new Menu() // 全局菜单配置项, 结婚日输入框的内容
	addBtn.addEventListener('click', () => {
		let context = content.value.trim() //去除空格

		// 获取输入框的内容(内容不为空时)
		if(content.value) {
			menuItem.append(new MenuItem({label: context, type: 'normal'}))
			content.value = '' //清空输入框
		}

		let menu = new Menu()
		menu.append(menuItem)

		Menu.setApplicationMenu(menu) //👈挂载菜单
	})

})