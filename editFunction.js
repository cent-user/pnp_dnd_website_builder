export default class clsEditFunctionController{
	constructor(pmouseStat){
		this.currActive = null; //to get what should be activated
		this.currActive_activated = null; //to check if its aleady activated (so it can only run once)
		this.currActive_lastMousePos = {x:0,y:0};

		this.thisElement = null;
		this.thisElementTable = null;
		this.mouseStat = pmouseStat;

		this.addComponent();
	}
	
	addComponent(){
		this.thisElement = this.createComponentFromString(this.storageComponent());
		this.thisElementTable = this.thisElement.querySelector('#editFunctionMenu_table');
		document.body.appendChild(this.thisElement);	
	}

	main(function_type = 0){
		if(!function_type==2 || !this.currActive){
			this.thisElement.style.display = 'none';
		}

		if(function_type==2){ //only run if fucntion type 2
			this.syncCurrTarget(); //sync curr target base on selected target
			if(this.currActive && !this.currActive_activated){ //if curr target and target hasn't been activated, display and process
				let offsetWidth = 0;
				let offsetHeight = 0;
				
				this.syncTableCurrActiveAttribute();
				this.thisElement.style.display = 'block';
				// make it so if element is in one corner, it reverse the positiob
					if(this.currActive_lastMousePos.x > document.documentElement.scrollWidth/1.5){
						offsetWidth = parseInt(this.thisElement.clientWidth);
					}
					if(this.currActive_lastMousePos.y > document.documentElement.scrollHeight/1.5){
						offsetHeight = parseInt(this.thisElement.clientHeight);
					}
				//
				
				this.thisElement.style.top = (this.currActive_lastMousePos.y - offsetHeight) +"px";
				this.thisElement.style.left = (this.currActive_lastMousePos.x - offsetWidth) +"px";
				

				this.currActive_activated = true;
			} 
			
			if(this.currActive){ //if there are current active element selected
				this.syncElementToTableValue();
				this.syncTable();
			}
		}
	}

	syncCurrTarget(){ 
		//if active target not the same as selected target, and the selected target isnt part of this element
		if((this.mouseStat.active_target != this.mouseStat.selected_target) && (this.mouseStat.active_target != this.currActive) ){
			this.currActive = null;
			this.currActive_activated = null;
		}

		if(this.mouseStat.selected_target) { //if item selected
			if(this.mouseStat.selected_target != this.thisElement && !this.hasAncestorWithIdObj(this.mouseStat.selected_target,{'editFunctionMenu':true})){ //if item selected not itself or not child of itself
				if(this.mouseStat.active_target == this.mouseStat.selected_target) { //if selected item can be activated
					if(this.currActive != this.mouseStat.selected_target ) {  //if selected item not the currently activated
						this.currActive_activated = null; //if assign new target, make it reactivate, so its know if its new target
						this.currActive = this.mouseStat.active_target;
						this.currActive_lastMousePos = {x:this.mouseStat.clientPageX,y:this.mouseStat.clientPageY};
					}
				}
			}
		}
		
		
	}
	
	storageComponent(){
		let comp = `
		<div id='editFunctionMenu' 
			style='
			position:fixed;
			padding:10px;
			background-color:#ffffee55;
			display:none;
			min-width:10vw;
			z-index:50;
			'
		>
			Attributes:
			<table id='editFunctionMenu_table'>
				<thead>
					<tr>
						<td>Name</td>
						<td>Value</td>
					</tr>
				</thead>
				<tbody>

				</tbody>
			</table>
		</div>
		`;
		return comp;
	}
	
	
	createComponentFromString(elString){
		//make div into node
		var temp_div = document.createElement("div");
		temp_div.insertAdjacentHTML("beforeend",elString);
		//get original div
		var original_div = temp_div.children[0];
		
		//get just the div
		var cleaned_div =  original_div.cloneNode(true);
		var cleaned_div_style_tags = cleaned_div.querySelectorAll('style');
		cleaned_div_style_tags.forEach(style => style.remove());
		
		var cleaned_div_script_tags = cleaned_div.querySelectorAll('script');
		cleaned_div_script_tags.forEach(script => script.remove());
		
		
		
		//rebuild the div 
		var div = cleaned_div;
			
			//make script into node
			const scripts = original_div.getElementsByTagName("script");
			for(var i = 0; i < scripts.length; i++){
				var script_node = document.createElement("script");
				script_node.textContent  = scripts[i].innerHTML;
				div.appendChild(script_node);
			}
			//
			
			//make style into node
			const styles = original_div.getElementsByTagName("style");
			for(var i = 0; i < styles.length; i++){
				var style_node = document.createElement("style");
				style_node.textContent  = styles[i].innerHTML;
				div.appendChild(style_node);
			}
			//

		return div;
	}

	syncTableCurrActiveAttribute(){ // sync table for the current active element
		//remove because its this plugin class
			this.currActive.classList.remove("draggable-hover");
			this.currActive.classList.remove("draggable_no_hover");
		//

		var attributes = this.currActive.attributes;
		var thisElementTbody = 	this.thisElementTable.getElementsByTagName('tbody');
		thisElementTbody = thisElementTbody[0];
		thisElementTbody.innerHTML = ""; //reset the table tbody
		
		for(let i = 0; i < attributes.length;i++){
			this.addNewRowTable(attributes[i].localName,attributes[i].nodeValue);
		}
	}

	syncTable(){ // sync tabel if last row not empty, add new row
		let tbody = this.thisElementTable.querySelector('tbody');
		let rows = tbody.querySelectorAll('tr');
		let lastRow = rows[rows.length - 1]

		let localname_el = lastRow.querySelector('.element_style_localname');
		let value_el = lastRow.querySelector('.element_style_value');

		if(localname_el.value != '' || value_el.value !=''){
			this.addNewRowTable();
		}
	}

	addNewRowTable(localname_value='',value_value=''){
		var thisElementTbody = 	this.thisElementTable.getElementsByTagName('tbody');
		thisElementTbody = thisElementTbody[0];

		let tr_node = document.createElement('tr');
		let td_node_localname = document.createElement('td');
		let td_node_value = document.createElement('td');
		let input_node_localname = document.createElement('input');
		let input_node_value = document.createElement('textarea');

		input_node_value.rows = 1;
		input_node_localname.classList.add("element_style_localname");
		input_node_value.classList.add("element_style_value");

		td_node_localname.append(input_node_localname);
		td_node_value.append(input_node_value);
		tr_node.append(td_node_localname);
		tr_node.append(td_node_value);
		thisElementTbody.append(tr_node);

		input_node_localname.value=localname_value;
		input_node_value.value=value_value;
	}

	syncElementToTableValue(){
		var tbody = this.thisElementTable.querySelector('tbody');
		var rows = tbody.querySelectorAll('tr');

		for(var i = 0; i< rows.length;i++){
			var localname_el = rows[i].querySelector('.element_style_localname');
			var value_el = rows[i].querySelector('.element_style_value');
			if(localname_el.value){
				this.currActive.setAttribute(localname_el.value,value_el.value);
			}
		}
	}

	hasAncestorWithIdObj(element, idObj) { //check if id in list of object
		// Traverse up the DOM tree
		if(element === document.documentElement || element === document.body){ //if html or body, return true ,so it will not cause error
			return true;
		}
			
		while (element) {
			if(element === document.documentElement || element === document.body){ //if html or body, return true ,so it will not cause error
				break;
			}
			
			// Check if the current element has the specified ID
			if (idObj[element.id]) {
				return true;
			}
			// Move to the parent element
			element = element.parentElement;
		}
		// No ancestor with the specified ID found
		return false;
	}
	
}