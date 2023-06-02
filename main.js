const { app, BrowserWindow } = require('electron')


// 运行主进程 -> 创建窗口 -> 创建渲染进程
// 运行在渲染进程
/*
	生命周期事件
		ready: app  		初始化完成
		dom-ready   		窗口中的文本加载完成
		did-finish-load  	导航完成时触发
		window-all-closed 	所有窗口都被关闭时触发
		before-quit 		在窗口关闭前触发
		will-quit 			在窗口关闭并且退出应用时触发
		quit 				所有窗口都被关闭时触发	 
		closed 				窗口关闭后触发
 */

// 创建窗口的方法
function createWin () {
	const mainWindow = new BrowserWindow({
		window: 600,
		height: 400,
	})

	// 在当前窗口中加载指定的界面 (html)
	mainWindow.loadFile('index.html')
}




app.whenReady().then(() => {
	createWin ()

	// 窗口关闭事件
	mainWindow.on('close', () => {
		console('窗口关闭了')
	})
})




app.on('window-all-closed', () => {
	console('所有窗口都关闭了')
	app.quit() //退出 app
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