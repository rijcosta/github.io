/**
 * Sample OpenUI5 Progressive Web Application
 * Simple TODO list
 */
sap.ui.getCore().attachInit(function todoApp() {
	//
	// Model
	//
	var aTasks = {};

	var url = "https://x8ki-letl-twmt.n7.xano.io/api:zDYSugTQ/teste";

	function loadTasks() {
		/*		var json = localStorage.getItem("tasks");
				try {
					aTasks = JSON.parse(json) || {};
				} catch (e) {
					jQuery.sap.log.error(e.message);
				}*/

		caches.keys().then(function (names) {
			for (let name of names)
				caches.delete(name);
		});
	var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {

			// Check if fetch request is done
			if (xhr.readyState == 4 && xhr.status == 200) {

				// Parse the JSON string
				aTasks = JSON.parse(xhr.responseText);
				populateList();
				// Call the showArtists(), passing in the parsed JSON string

			}
		};
		xhr.open("GET", url);
		xhr.send();

	}

	function saveTasks(description) {
		localStorage.setItem("tasks", JSON.stringify(aTasks));

		const params = {
			"Nome": description
		}
	var xhr = new XMLHttpRequest();
		xhr.open("POST", url);
		xhr.setRequestHeader('Content-type', 'application/json')

		xhr.send(JSON.stringify(params))

		xhr.onload = function () {
			// Do whatever with response

		}

	}

	function addTask(description) {
		var id = Date.now();
		aTasks[id] = {
			id: id,
			Nome: description
		};

		saveTasks( description );

		return aTasks[id];
	}

	function deleteTask(id) {
		delete aTasks[id];
	
	
		const params = {
			"teste_id": id
		}
	var xhr = new XMLHttpRequest();
		xhr.open("DELETE", url+'/'+id);
		xhr.setRequestHeader('Content-type', 'application/json');

		xhr.send(null);

 
	
	
	
	
	
	
	
		saveTasks();
	}

	//
	// Controller
	//
	var oListTodo;
	var oInputAddTask;

	function createListItem(mTask) {
		var listItem = new sap.m.DisplayListItem({
			label: mTask.Nome,
			value: mTask.id
		}).data("id", mTask.id);
	
	
	
		oListTodo.addAggregation("items", listItem);
	}

	function deleteListItem(oListItem) {
		var id = oListItem.data("id");
		oListTodo.removeAggregation("items", oListItem);
		deleteTask(id);
	}

	function populateList() {
		for (var id in aTasks) {
			createListItem(aTasks[id]);
		}
	}

	function addNewTask() {
		var description = oInputAddTask.getValue();
		if (description) {
			var task = addTask(description);
			createListItem(task);
			oInputAddTask.setValue("");
			addTaskButton.setEnabled(false);
		}
	}

	function onSwipeDelete() {
		deleteListItem(oListTodo.getSwipedItem());
		oListTodo.swipeOut();
	}

	function onDeleteItem(oEvent) {
		deleteListItem(oEvent.getParameter("listItem"));
	}

	//
	// View
	//
	var app = new sap.m.App("myApp");

	oInputAddTask = new sap.m.Input("addTaskInput", {
		placeholder: "Adicionar Jogador",

		value: "",
		width: "80%",
		submit: addNewTask,
		liveChange: function (oEvent) {
			addTaskButton.setEnabled(!!oEvent.getParameter("value"));
		}
	});

	oListTodo = new sap.m.List({
		inser: true,
		mode: "Delete",
		noDataText: "Relax, you have no tasks for today :)",
		delete: onDeleteItem,
		swipeContent: new sap.m.Button({
			text: "Delete",
			type: "Reject",
			press: onSwipeDelete
		}),
		items: []
	});

	var addTaskButton = new sap.m.Button("addTaskButton", {
		text: "Add",
		enabled: false,
		press: addNewTask
	});

	/*	var footer = new sap.m.Toolbar("footer", {
			content: [oInputAddTask, addTaskButton]
		});*/

	var todoPage = new sap.m.Page("todoPage", {
		title: "UI5 TODO Sample",

		showNavButton: false,
		showFooter: true,
		floatingFooter: true,
		//	footer: footer,
		content: [oInputAddTask, addTaskButton, oListTodo]
	});

	// Start application
	loadTasks();
	//populateList();

	app.addPage(todoPage);
	app.setInitialPage("todoPage");

	document.getElementById("splash-screen").remove(); // delete the splash screen
	app.placeAt("body", "only");
});