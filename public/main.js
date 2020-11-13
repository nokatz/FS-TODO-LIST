

let selectedIndex = -1;

let heading;
let btns, addBtn, editBtn, delBtn;
let form, message, inputField;
let list;
let okBtn, cancelBtn;
let editMode = false;

let m0, m1, drag = false, indexToMove;


getDomElements();

editBtn.disabled = true;
delBtn.disabled = true;

// let todo = {};
let todos = [];

readFromServer(populateList);

addBtn.addEventListener('click', showForm);
editBtn.addEventListener('click', showForm);

function showForm(e){
	
	form.style.display = 'block';	
	btns.style.display = 'none';
	
	let lbl;
	
	if(e.target.textContent === 'Add'){
		
		editMode = false;
		inputField.value = '';
		
		lbl = 'adding...';
	
	} else if (e.target.textContent === 'Edit'){
	
		editMode = true;
		inputField.value = todos[selectedIndex]; 
	
		lbl = 'editing...';
	}
	
	message.textContent = lbl;
	message.style.display = "block";
	
}


okBtn.addEventListener('click', refreshList);

function refreshList(e){

	e.preventDefault();

	if(!editMode){
		
		if(selectedIndex === -1){
			todos.push(inputField.value);		
		} else {
			todos.splice(selectedIndex + 1, 0, inputField.value);		
		}	
			
		let li = document.createElement('li');
		li.textContent = inputField.value; 

		li.addEventListener('click', toggleSelect);
	
	} else if(editMode){
		
		todos[selectedIndex] = inputField.value; 
		
	}
	
	populateList();
	// writeToServer(populateList);
	
	form.style.display = 'none';
	btns.style.display = 'block';
	
	deselectAll();
	
}

cancelBtn.addEventListener('click', (e) => {

	e.preventDefault();
	
	form.style.display = 'none';
	btns.style.display = 'block';
	
	deselectAll();
	
	return;

});


delBtn.addEventListener('click', (e) => {
	
	todos.splice(selectedIndex, 1); 

	populateList();
	
	editBtn.disabled = true;
	delBtn.disabled = true;
	
});


function populateList(){
	
	list.innerHTML = "";
	
	for(let i = 0; i < todos.length; i++){
		
		let item = document.createElement('li');
		item.textContent = todos[i];

		item.addEventListener('click', toggleSelect);
		
		list.appendChild(item);
		
	}	
	
	// window.localStorage.setItem('todos', JSON.stringify(todos));
	writeToServer();
	// console.log('todos :', todos);
}



function toggleSelect(e) {
	
	// console.log('selected');
	let btnsStyle = window.getComputedStyle(btns);
	if(btnsStyle.getPropertyValue('display') === 'none')
		return;
		
	let selected = e.target.classList.contains('selected');
	
	deselectAll();
	
	if(selected){

		e.target.classList.remove('selected');
		// selectedIndex = -1;

		editBtn.disabled = true;
		delBtn.disabled = true;
	
	} else {
		
		e.target.classList.add('selected');
		
		editBtn.disabled = false;
		delBtn.disabled = false;
		
		selectedIndex = todos.indexOf(e.target.textContent);
		
	}
	
}

function deselectAll(){
	
	let items = document.getElementsByTagName('li');
		
	for(let i = 0; i < items.length; i++){
		items[i].classList.remove('selected');
	}
	
	selectedIndex = -1;
	
	editBtn.disabled = true;
	delBtn.disabled = true;
}



function getDomElements(){
	
	heading = document.getElementsByTagName('h1')[0];
	
	list = document.getElementById('list');

	btns = document.getElementById('btns');
	addBtn = document.getElementById('add-btn');
	editBtn = document.getElementById('edit-btn');
	delBtn = document.getElementById('del-btn');
	
	message = document.getElementById('message');
	inputField = document.getElementById('todo');
	okBtn = document.getElementById('ok');
	cancelBtn = document.getElementById('cancel');
	
	form = document.getElementById('form'); 
	
}

function readFromServer(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/todos', true); // path to the file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
			 showData(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);

    function showData(obj){

		if(obj){
			// for(let i = 0; i < obj.todos.length; i++){
			// 	todos[i] = obj.todos[i].todo;
			// }
			todos = obj;
		} else {
			todos = [];
		}

		callback(todos);
    }
}
function writeToServer() {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("text/plain");
    // xobj.overrideMimeType("application/json");
    xobj.open('POST', '/todos', true); // path to the file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
			//  showData(JSON.parse(xobj.responseText));
			console.log('from xhr: ' + xobj.responseText);
        }
    };
	xobj.send(JSON.stringify(todos));	
}


