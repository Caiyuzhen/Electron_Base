const { app, BrowserWindow } = require('electron')


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

// ✏️ 创建窗口的方法 ————————————————————————————————————————————————————————————————————————————————————————————————
function createWin () {
	let mainWindow = new BrowserWindow({
		x: 10,// 窗口打开的位置(相对于桌面左上角)
		y: 10, // 窗口打开的位置(相对于桌面左下角)
		show: false, //👀 等内容加载完再显示窗口, 避免白屏
		height: 400,
		maxHeight: 1000,// 设置窗口拉伸最大值
		minHeight: 200,// 设置窗口拉伸最小值
		width: 600,// 窗口宽度
		maxWidth: 1600,// 设置窗口拉伸最大值
		minWidth: 400,// 设置窗口拉伸最小值
		resizable: false, //不允许缩放窗口
	})

	mainWindow.on('ready-to-show', () => {
		mainWindow.show() //👀等内容加载完后再显示窗口(避免白屏)
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