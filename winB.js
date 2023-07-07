const { ipcRenderer } = require('electron') // 引入 ipcRenderer 用于渲染进程和主进程之间的通信

// 👇 【渲染进程之间的通讯】 _________________________________________________________________________________
window.onload = function() { //👈从 loaclStorage 中取出数据并插入到输入框内
	let oInput = document.querySelector('#txt')
	let val = localStorage.getItem('winAData')
	oInput.value = val
	console.log(oInput, val)


	// 发送数据给 winA 渲染进程
	const btn = document.querySelector('#btn')
	btn.addEventListener('click', () => {
		ipcRenderer.send('stm', '这是来自 winB 的数据')
	})
}