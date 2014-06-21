var s = document.createElement('script');
s.src = chrome.extension.getURL('tfs_enhancer.js');
document.body.appendChild(s);
s.onload = function () { 
	s.parentNode.removeChild(s);
};