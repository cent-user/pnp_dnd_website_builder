export default class clsEditFunctionController{
	constructor(pmouseStat){
		this.currActive = null; //to get what should be activated
		this.currActive_activated = null; //to check if its aleady activated (so it can only run once)
		this.currActive_lastMousePos = {x:0,y:0};
		this.currActive_attributes = {};
		this.thisElement = null;
		this.thisElementTextArea = null;
		
		this.thisElementTable = null;
		this.mouseStat = pmouseStat;

		this.addComponent();
	}
	
	addComponent(){
		this.thisElement = this.createComponentFromString(this.storageComponent());
		this.thisElementTable = this.thisElement.querySelector('#editFunctioNMenu_table');
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
		}
	}

	syncCurrTarget(){ 
		if(this.mouseStat.selected_target) { //if item selected
			if(this.mouseStat.selected_target != this.thisElement){ //if item selected not itself
				if(this.mouseStat.active_target == this.mouseStat.selected_target) { //if selected item can be activated
					if(this.currActive != this.mouseStat.selected_target ) {  //if selected item not the currently activated
						this.currActive = this.mouseStat.active_target;
						this.currActive_lastMousePos = {x:this.mouseStat.clientPageX,y:this.mouseStat.clientPageY};
					}
				}
			}
		}
		
		if(this.mouseStat.active_target != this.mouseStat.selected_target){
			this.currActive = null;
			this.currActive_activated = null;
		}
	}
	
	storageComponent(){
		let comp = `
		<div id='editFunctioNMenu' 
			style='
			position:fixed;
			padding:10px;
			background-color:#ffffee55;
			display:none;
			min-width:10vw;
			z-index:50;
			'
		>
			<table id='editFunctioNMenu_table'>
				
			</table>
		</div>
		`;
		return comp;
	}
	
	
	createComponentFromString(elString){
		//make div into node
		var temp_div = document.createElement("div");
		temp_div.insertAdjacentHTML("beforeend",elString);
		console.log(temp_div);
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

	syncTableCurrActiveAttribute(){
		//remove because its this plugin class
			this.currActive.classList.remove("draggable-hover");
			this.currActive.classList.remove("draggable_no_hover");
		//

		var attributes = this.currActive.attributes;
		this.thisElementTable.innerHTML = ""; //reset the table
		console.log(this.currActive.classList);
		for(let i = 0; i < attributes.length;i++){
			

			let tr_node = document.createElement('tr');
			let td_node_localname = document.createElement('td');
			let td_node_value = document.createElement('td');
			let input_node_localname = document.createElement('input');
			let input_node_value = document.createElement('textarea');

			input_node_value.rows = 1;

			td_node_localname.append(input_node_localname);
			td_node_value.append(input_node_value);
			tr_node.append(td_node_localname);
			tr_node.append(td_node_value);
			this.thisElementTable.append(tr_node);
			
			input_node_localname.value=attributes[i].localName;
			input_node_value.value=attributes[i].nodeValue;
			

		}
	}

	syncTable(){
		var table = this.thisElementTable;
		var lastRow = table.rows[table.rows.length]
	}


	
}