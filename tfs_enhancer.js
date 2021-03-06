(function() {
	var workItemStore
		, tiles
		, qsa = document.querySelectorAll.bind(document)
		, qs = document.querySelector.bind(document)
		, workItemIds
		, taskboardEl = qs('#taskboard')
		, observer = new MutationObserver(mutationOccurred);
		
	function mutationOccurred(mutations) {
		mutations.forEach(function (m) {
			var nodes = m.addedNodes ? Array.prototype.slice.call(m.addedNodes) : []
				, nodesToProcess = [];
			
			nodes.forEach(function (n) {
				/* The task board gets added right after page load */
				if (n.id === TFS.Agile.TaskBoard.TaskBoardView.TASKBOARD_ID) {
					Array.prototype.push.apply(nodesToProcess, n.querySelectorAll('div.tbTile'));
				} else if (n.nodeType === 1 && n.matches('div.tbTile')) {
					nodesToProcess.push(n);
				}
			});
			
			processWorkItems(nodesToProcess);
		});
	}
	
	function modifyWorkItem(id, type, title) {
		var el = qs('#tile-' + id)
			, titleEl = el.querySelector('div.witTitle');
		
		titleEl.innerText = (type + ' ' + id + ': ') + title;
	}
	
	function getWorkItemData(workItemIds) {
		var workItemStore = TFS.OM.TfsTeamProjectCollection.getDefaultConnection().getService(TFS.WorkItemTracking.WorkItemStore);

		workItemStore.workItemManager.store.beginGetWorkItemData(workItemIds, function (result) {
			if (result instanceof Array === false) {
				result = [result];
			}
			result.forEach(function (workItemData) {
				modifyWorkItem(
					workItemData.fields[-3], 
					workItemData.fields[25],
					workItemData.fields[1]
				);
			});
		});
	}
		
	function processWorkItems(workItemNodes) {
		var tiles = Array.prototype.slice.call(workItemNodes)
			, taskData = TFS.Core.Utils.parseMSJSON(taskboardEl.querySelector('script').innerText).payload.data
			, otherWorkItems = [];
			
			tiles.forEach(function (tile) {
				var id = tile.id.replace('tile-', '');
				
				if (taskData.hasOwnProperty(id)) {
					modifyWorkItem(id, taskData[id][1], taskData[id][3]);								
				} else {
					otherWorkItems.push(id);
				}
			});
			
			if (otherWorkItems.length) {
				getWorkItemData(otherWorkItems);
			}			
	}

	if (typeof(taskboardEl) !== 'undefined') {
		observer.observe(taskboardEl, {
			subtree: true,
			childList: true
		});
	}
})();