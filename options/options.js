(function () {
	function restoreValues() {
		chrome.storage.sync.get('TFS2012WebEnhancer', function (result) {
			document.querySelector('#web-interface-url').value = result.TFS2012WebEnhancer.url;
		});
	}

	restoreValues();

	document.querySelector('#options-form').addEventListener('submit', function () {
		var url = this['web-interface-url'];
		
		chrome.storage.sync.set({
			'TFS2012WebEnhancer': {
				url: url.value
			}
		});
	});
})();