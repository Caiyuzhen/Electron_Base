// 👇【渲染进程(实际的内容都是渲染进程)】, 无法使用 Node, 除非在 main.js 这个主进程中设置 webPreferences, 并且需要安装 npm install @electron/remote --save 包
// References: https://blog.csdn.net/baixue0111/article/details/122088933
// const { BrowserWindow } = require('electron')
const BrowserWindow = require("@electron/remote").BrowserWindow
const currentWindow = require("@electron/remote").getCurrentWindow() // 获取当前的窗口对象 ger Current Window
const { MenuItem, Menu } = require("@electron/remote")
const { ipcRenderer } = require('electron') // 引入 ipcRenderer 用于渲染进程和主进程之间的通信
const { dialog } = require('@electron/remote') // 引入对话框组件
const { shell } = require('@electron/remote')
const path = require('path')


// 加载完毕后执行
window.addEventListener('DOMContentLoaded', () => {
	// 👇 【关闭窗口前的提醒】 _________________________________________________________________________________
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



	// 👇 【新建父子窗口】 _________________________________________________________________________________
	const btn1 = document.getElementById('btn-1')
	btn1.addEventListener('click', () => {
		// 🚀 创建一个新窗口
		// alert('msg')
		let indexWindow = new BrowserWindow({
			parent: currentWindow, //👈设置父窗口为谁 (如果有父子关系的话, 则会拖动时会跟随移动)
			// modal: true, //需要有父子关系才能设置为 模态弹窗！ 会禁用底部的操作
			width: 800,
			height: 800,
		})
		
		indexWindow.loadFile('sub.html')

		indexWindow.on('close', () => {
			indexWindow = null
		})
	})



	// 👇 【右侧 3 个窗口 icon】 _________________________________________________________________________________
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



	// 👇 【动态的自定义菜单】 _________________________________________________________________________________
	let customBtn = document.querySelector('.custom-menu')
	let content = document.querySelector('#menuCon')
	let addBtn = document.querySelector('.add-menu')


	// 替换为自己的菜单
	customBtn.addEventListener('click', () => {
		// 创建 menu 菜单
		let menuA = new MenuItem({label: 'AAA', type: 'normal'})
		let customMenu2 = new MenuItem({label: '自定义菜单', type: 'submenu', submenu: [{ label: '重载', role: 'reload' },{ label: '重做', role:'redo' },]})
		let customMenu3 = new MenuItem({label: '自定义菜单', type: 'submenu', submenu: [{ label: '取消', role: 'undo' },{ label: '剪切', role:'cut' },]})
	
		let menu = new Menu()
		menu.append(menuA)
		menu.append(customMenu2)
		menu.append(customMenu3)

		Menu.setApplicationMenu(menu) //👈挂载到顶部菜单
	})

	
	// 获取输入框的内容, 并且添加到菜单中
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

		Menu.setApplicationMenu(menu) //👈挂载到顶部菜单
	})


	// 👇 【右键菜单】 _________________________________________________________________________________
	let contextTemp = [
		{label: '启动'},
		{label: '跳转'},
		{
			label: '其他',
			click() {
				console.log('被点击了')
			}
		}
	]

	let rightMenu = Menu.buildFromTemplate(contextTemp)

	window.addEventListener('contextmenu', (e) => { // ⚡️ contextmenu 右键
		e.preventDefault() //阻止某些元素的默认右键事件
		rightMenu.popup({ //👈弹出右键菜单
			window: currentWindow //在哪个窗口进行弹出
		}) 
	}, false) // false: 冒泡阶段, true: 捕获阶段

})



// 👇 【渲染进程与主进程的通讯】 _________________________________________________________________________________
window.onload = function() {
	let aBtn = document.querySelector('.btn-55')
	let cBtn = document.querySelector('.btn-66')

	//向主进程发送异步消息
	aBtn.addEventListener('click', () => { 
		ipcRenderer.send('msg', '😄这是渲染进程, 向主进程发送异步消息')
	})

	ipcRenderer.on('reply', (event, data) => { //接收主进程的异步消息
		console.log(data)
	})

	cBtn.addEventListener('click', () => {
		let val = ipcRenderer.sendSync('msg2', '😄这是渲染进程, 向主进程发送同步消息')
		console.log(val) //等待主进程返回的值（同步消息）
	})

	ipcRenderer.on('mtp', (e, data) => {
		console.log('获得主进程主动发来的消息:', data)
	})
}




window.onload = function () {
	// 👇 【渲染进程之间的通讯】 _________________________________________________________________________________
	//给 winB 发送消息【基于 loaclStorage 的方法】（通过 main.js 中转） ————————————————————————————————
	let btn8 = document.querySelector('.btn-88')
	btn8.addEventListener('click', () => { 
		ipcRenderer.send('openWinB', '😄这是渲染进程 A') // 【win to index 方法二】第一步
		// 打开窗户 2 后保存数据
		// localStorage.setItem('winAData', '啦啦啦') //🔥先删除, 方法二不基于 localStorage
	})


	// 接收 winB 发来的消息（通过 main.js 中转） ————————————————————————————————
	// winB.js 发送数据到 index.js
	ipcRenderer.on('returnToIndex', (e, data) => {
		console.log(data)
	})







	// 🚀显示文件选择框 _________________________________________________________________________________
	let btn = document.querySelector('#dialog')
	let btnErr = document.querySelector('#btn-err')
	
	 // 打开系统的文件选择器
	btn.addEventListener('click', () => {
		dialog.showOpenDialog({
			defaultPath: __dirname, //默认打开的路径 (defaultPath: __dirname 这样为当前文件夹的路径)
			buttonLabel: '选择', //确认的按钮文案
			title: '对话框的标题', //title 文案
			properties: [ //👈文件相关的配置项
				// 'openDirectory',  // 打开目录
				'openFile', // 打开文件
				'multiSelections', // 允许多选
				"createDirectory" // 允许创建目录
			],
			filters: [ // 🔥提供一个过滤器
				{ 
					name: '图片文件', 
					extensions: ['jpg', 'png', 'gif'] //扩展名
				},
				{
					name: '代码文件',
					extensions: ['js', 'css', 'html']
				},
				{
					name: '媒体文件',
					extensions: ['avi', 'pm4', 'wmv']
				}
			]
		}).then((res) => { //在渲染进程中 (index.html) 可以获得到返回的值（文件选择后的文件信息）
			console.log(res)
		})
	})

	// 打开系统的报错对话框
	btnErr.addEventListener('click', () => {
		dialog.showErrorBox(
			'自定义标题',
			'错误内容'
		)
	})







	// 打开 URL ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
	let urlBtn = document.querySelector('#openURL')
	let openFileBtn = document.querySelector('#openFile')

	// 打开外部链接
	urlBtn.addEventListener('click', (e) => {
		e.preventDefault()//禁用 a 标签的默认行为
	
		let urlPath = urlBtn.getAttribute('href') //获取 a 标签的 href 属性
		console.log(urlPath)

		shell.openExternal(urlPath) //打开外部链接(🌟利用 shell 的能力)
	})

	// 打开当前项目的目录
	openFileBtn.addEventListener('click', (e) => {
		shell.showItemInFolder(path.resolve(__filename)) //打开文件所在的目录
	})






	// 消息通知 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
	let msgBtn = document.querySelector('#msgBtn')
	msgBtn.addEventListener('click', () => {
		// 消息的信息
		let option = {
			title: '消息通知的标题',
			body: '消息通知的内容',
			icon: './icon/rocket.ico'
		}

		let newNotification = new Notification(option.title, option) //👈创建一个新的通知
		newNotification.onclick = () => { //👈点击通知后的回调
			console.log('点击了这条消息')
		}
	})
}

