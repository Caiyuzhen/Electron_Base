const { app, BrowserWindow, contextBridge, ipcRenderer, nativeImage, Menu } = require('electron')
const path = require('path')



// 运行主进程 -> 创建窗口 -> 创建渲染进程
// 运行在渲染进程
/*
	APP 的生命周期（不是事件的声明周期）
		ready: app  		初始化完成
		dom-ready   		窗口中的 DOM 元素加载完成
		did-finish-load  	导航完成加载时触发
		window-all-closed 	所有窗口都被关闭时触发
		before-quit 		在窗口关闭前触发
		will-quit 			在窗口关闭并且退出应用时触发
		quit 				所有窗口都被关闭时触发	 
		closed				窗口关闭后触发
 */

// 👇【主进程】
// ✏️ 创建窗口的方法 ————————————————————————————————————————————————————————————————————————————————————————————————
function createWin () {
	let mainWindow = new BrowserWindow({
		frame: false, //显示系统栏
    	// autoHideMenuBar: false,
		x: 10,// 窗口打开的位置(相对于桌面左上角)
		y: 10, // 窗口打开的位置(相对于桌面左下角)
		show: false, //👀🔥 等内容加载完再显示窗口, 避免白屏
		height: 400,
		maxHeight: 1000,// 设置窗口拉伸最大值
		minHeight: 200,// 设置窗口拉伸最小值
		width: 600,// 窗口宽度
		maxWidth: 1600,// 设置窗口拉伸最大值
		minWidth: 400,// 设置窗口拉伸最小值
		resizable: true, //允许缩放窗口
		title: '自定义名称-Rocket Dev',
		icon: './icon/rocket.ico',
		webPreferences: {
			nodeIntegration: true, //👈 允许渲染进行使用 Node
			contextIsolation: false, //👈 允许渲染进行使用 Node
			enableRemoteModule: true, //👈 允许渲染进行使用 Node
		}
		// frame: true, //顶部的系统菜单栏
		// autoHideMenuBar: true, //自动隐藏菜单栏
		// transparent: true, //透明窗口(可以用在比如歌词窗口)
	})





	// 👇 引入打开第二个窗口的方法(允许渲染进程中使用 require 来引入主进程的模块)
	require("@electron/remote/main").initialize() // 初始化远程模块
	require("@electron/remote/main").enable(mainWindow.webContents) // enable() 方法用于启用指定 webContents 对象上的远程模块功能


	mainWindow.on('ready-to-show', () => {
		mainWindow.show() //👀🔥 等内容加载完后再显示窗口(避免白屏)
	})

	// 在当前窗口中加载指定的界面 (html)
	mainWindow.loadFile('index.html') //加载本地 html 文件

	// DOM 元素完成加载
	mainWindow.webContents.on('dom-ready', () => {
		console.log('222 --- DOM 完成加载')
	})

	// 导航完成加载
	mainWindow.webContents.on('did-finish-load', () => {
		console.log('333 --- 导航完成加载')
	})

	// 窗口关闭事件
	mainWindow.on('close', () => {
		console.log('888 --- 窗口关闭了') //👈👈如果有多个窗口, 888 就是会在最后一步！！！ 如果是只有一个窗口就不是在最后执行, 而是在 333 之后
		mainWindow = null //🚀释放内容空间
	})





	// 🦐 自定义菜单
	const template = [
		{
			label: 'Logo',
			submenu: [ //系统菜单
				{ role: 'about' },
				{ type: 'separator' },
				{ role: 'services' },
				{ type: 'separator' },
				{ role: 'hide' },
				{ role: 'hideOthers' },
				{ role: 'unhide' },
				{ type: 'separator' },
				{ role: 'quit' },

			],
		},
		{
			label: '文件',
        	submenu: [
				{
					label: '打开文件' ,
					accelerator: 'CmdOrCtrl+N', //快捷键
					click: () => {
						console.log('打开了文件')
					}
				},
			],
		},
		{
			label: '编辑',
			submenu: [
				{ role: 'undo' },
				{ role: 'redo' },
				{ type: 'separator' }, //分割线
				{ role: 'cut' },
				{ role: 'copy' },
				{ role: 'paste' },
			],
		},
		{
			label: '视图',
			submenu: [
				{ role: 'reload' },
				{ role: 'forceReload' },
				{ role: 'toggleDevTools' },
				{ type: 'separator' },
				{ role: 'resetZoom' },
				{ role: 'zoomIn' },
				{ role: 'zoomOut' },
				{ type: 'separator' }, //分割线
				{ role: 'togglefullscreen' },
			],
			accelerator: 'CmdOrCtrl+Shift+I',
			click: () => {
				const win = BrowserWindow.getFocusedWindow()
				win.webContents.openDevTools()
			}
		},

		// 👇 Electron 的 Menu 类要求菜单模板中的每个菜单项都必须具有label、role或type属性中的至少一个
		// 		// { role: 'reload' },
		// 		// { role: 'forceReload' },
		// 		// { role: 'toggleDevTools' },
		// 		// { type: 'separator' },
		// 		// { role: 'resetZoom' },
		// 		// { role: 'zoomIn' },
		// 		// { role: 'zoomOut' },
		// 		// { type: 'separator' },
		// 		// { role: 'togglefullscreen' },
		// { label: 'Menu Item 2', type: 'checkbox', checked: true }
	]
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
}




// ⚡️ 初始化完成后, 创建窗口 ————————————————————————————————————————————————————————————————————————————————————————————————
app.on('ready', () => { 
	console.log('111 --- 窗口被创建')
	createWin() //👆调用创建窗口的函数
}) 



// ❌ 窗口都关闭后的事件 ————————————————————————————————————————————————————————————————————————————————————————————————
app.on('window-all-closed', () => { //🔥如果有这个事件, 就需要手动的写上 app.quit() !!! 不然 555、666、777 都不会被执行！ 
	console.log('444 --- 所有窗口都关闭了')
	// app.quit() //退出 app
	// Mac 平台下隐藏在底部工具栏
	const macOS = process.platform === 'darwin'
	if (!macOS) {
		app.quit()
	} else {
		// 隐藏底部工具栏
		app.dock.hide()
	}
	
})


// 👀 窗口关闭前的事件 ————————————————————————————————————————————————————————————————————————————————————————————————
app.on('before-quit', () => {
	console.log('555 --- 窗口关闭前')
	// app.quit() //退出 app
})


// 🧊 窗口即将关闭事件 ————————————————————————————————————————————————————————————————————————————————————————————————
app.on('will-quit', () => {
	console.log('666 --- 窗口即将关闭')
	// app.quit() //退出 app
})


// ⚠️ 窗口关闭时事件 ————————————————————————————————————————————————————————————————————————————————————————————————
app.on('quit', () => {
	console.log('666 --- 窗口关闭时')
	// app.quit() //退出 app
})







// app.whenReady().then(() => {
// 	const mainWindow = new BrowserWindow({
// 		window: 600,
// 		height: 400,
// 	})

// 	// 在当前窗口中加载指定的界面 (html)
// 	mainWindow.loadFile('index.html')

// 	// 窗口关闭事件
// 	mainWindow.on('close', () => {
// 		console('窗口关闭了')
// 	})
// })

// app.on('window-all-closed', () => {
// 	console('所有窗口都关闭了')
// 	app.quit() //退出 app
// })