// 👇 【渲染进程之间的通讯】 _________________________________________________________________________________
window.onload = function() {
	let oInput = document.querySelector('#txt')
	let val = localStorage.getItem('winAData')
	oInput.value = val
	console.log(oInput, val)
}