// 👇 【渲染进程之间的通讯】 _________________________________________________________________________________
window.onload = function() { //👈从 loaclStorage 中取出数据并插入到输入框内
	let oInput = document.querySelector('#txt')
	let val = localStorage.getItem('winAData')
	oInput.value = val
	console.log(oInput, val)
}