export default class clsObjectMenu{
	constructor(clsMouseStat){
		this.clsMouseStat = clsMouseStat;

		//menu
		this.currentMenu = null;
		this.currentMenu_content = null;

		this.currTargetEl = null; //to check whatn target click
		this.lastTargetEl = null; //to check when target changed
		this.select_target_el = null //active target, default is curr target, but can be chosen by currselectparentlist
		this.currParentList = null;
		this.currSelectParentList = null;

		
		this.component = [];
		this.lastSelectedComponentElement  = null;
		this.stateTrigger = [];
		this.stateTrigger['open_div'] = true;
		this.stateTrigger['select_target'] = 0;
		this.stateTrigger['manual_trigger'] = 0;
		this.menuDisplay();
		this.menuDisplay_functionality();
		this.ui_style();
	}
	menuDisplay(){
		var tmp_div = `
				<div>
					<div>
						Append Type:
						<select id='clsObjectMenu_appendType' style="width:100%">
							<option value='beforeend'>Before End</option>
							<option value='beforebegin'>Before Begin</option>
							<option value='afterend'>After End</option>
							<option value='afterbegin'>After Begin</option>
						</select>
					</div>
					<br>
					<button id='clsObjectMenu_selectTarget' style="width:100%">Select Target</button>
					<div id='clsObjectMenu_selectTarget_Select'></div>
					<div>
						<button id='clsObjectMenu_deleteElement' style="width:100%">Delete Element</button>
					</div>
					<div>
						<textarea id='clsObjectMenu_liveComponent_textarea' style="width:100%"></textarea>
						<button id='clsObjectMenu_liveComponent_getButton' style="width:100%">String To Element</button>
					</div>
					<br>
					<div>
						<input id='clsObjectMenu_fileSelector' type='file' webkitdirectory multiple />
						<label for='clsObjectMenu_fileSelector'>Load Component</label>
					</div>
					
					<div id='clsObjectMenu_objectStorage'>
					
					</div>
				</div>
			`;
		var div_content = this.createComponentFromString(tmp_div);
		div_content.style.zIndex = '3';
		var div = document.createElement('div');
		
		div.classList.add('clsMainProperties');
        div.style.backgroundColor = '#aaddddaa';
        div.style.position = "fixed";

		div_content.classList.add('clsObjectMenu_divContent');

		//open / close menu
		var div_btn_open_close = document.createElement('button');
		div_btn_open_close.style.width = '50px';
		div_btn_open_close.style.height = '20px';
		div_btn_open_close.style.backgroundColor = '#eeddaa';
		div_btn_open_close.style.position = 'relative';
		div_btn_open_close.style.left = '-50px';
		div_btn_open_close.style.top = '20px';
		
		div_btn_open_close.innerHTML = 'Add';

		div.appendChild(div_content);
		document.body.appendChild(div);
		div.insertAdjacentElement('afterbegin',div_btn_open_close);
		
        div_btn_open_close.addEventListener('click',function(){
            this.stateTrigger['open_div'] = !this.stateTrigger['open_div'];
        }.bind(this));

		this.currentMenu = div;
		this.currentMenu_content = div_content;
	}


	menuDisplay_functionality(){
		var append_type =  this.currentMenu.querySelector('#clsObjectMenu_appendType');
		/////////////////// if select target button pressed,assign taget for the inserted element,default is body ///////////////////
		var clsObjectMenu_selectTarget = this.currentMenu.querySelector('#clsObjectMenu_selectTarget');	
		clsObjectMenu_selectTarget.addEventListener('click',function(e){
			this.stateTrigger['select_target'] = 1;
		}.bind(this));
		//////////////////////////////////////////////////////////////////////////////////////////////////
		/////////////////// file selector inputted, load component list ///////////////////////////////////
		var objectMenu_fileSelector = this.currentMenu.querySelector('#clsObjectMenu_fileSelector');	
		objectMenu_fileSelector.addEventListener('change',function(e){
				var files = e.target.files;
				this.loadComponent(files);
				e.stopPropagation();
			}.bind(this));
		//////////////////////////////////////////////////////////////////////////////////////////////////
		/////////////////// if get live component button pressed, realize the inputted component ///////////////////
		var objectMenu_liveComponent_getButton = this.currentMenu.querySelector('#clsObjectMenu_liveComponent_getButton');
		objectMenu_liveComponent_getButton.addEventListener('mousedown',function(e){
			var stringForElement = this.currentMenu.querySelector('#clsObjectMenu_liveComponent_textarea');
			var createdComponent = this.createComponentFromString(stringForElement.value);
			
			if(this.select_target_el == null){
				document.body.insertAdjacentElement(append_type.value,createdComponent);
			} else {
				this.select_target_el.insertAdjacentElement(append_type.value,createdComponent);
			}

			this.lastSelectedComponentElement = createdComponent;
		}.bind(this));
		//////////////////////////////////////////////////////////////////////////////////////////////////
		/////////////////// if delete element button pressed, delete the target element ///////////////////
		var objectMenu_deleteElement_button = this.currentMenu.querySelector('#clsObjectMenu_deleteElement');
		objectMenu_deleteElement_button.addEventListener('mousedown',function(e){
			if(this.select_target_el != null && this.select_target_el.tagName != 'BODY'){
				this.select_target_el.remove();

				this.currTargetEl = null; //to check whatn target click
				this.lastTargetEl = null; //to check when target changed
				this.select_target_el = null //active target, default is curr target, but can be chosen by currselectparentlist
				this.currParentList = null;
				this.currSelectParentList = null;

				this.clsMouseStat.lastElementValidTarget.down = null; //because deleted, remove it from last target down

				this.stateTrigger['manual_trigger'] = 1;
				this.stateTrigger['change_target'] = 1;
			}
		}.bind(this));
		//////////////////////////////////////////////////////////////////////////////////////////////////
		
	}

	resizeDisplay(){
       
        if(this.clsMouseStat.state.smallWindow == 0){
            this.currentMenu.style.width = "150px";
            this.currentMenu.style.height = "100%";
            this.currentMenu.style.right = "0px";
            this.currentMenu.style.top = "0px";
        }

        if(this.clsMouseStat.state.smallWindow == 1){
            this.currentMenu.style.width = "50%";
            this.currentMenu.style.height = "100%";
            this.currentMenu.style.right = "0px";
            this.currentMenu.style.top = "0px";
        }

        if(this.stateTrigger['open_div'] == true){
            this.currentMenu_content.style.display = 'block';
			this.currentMenu.style.zIndex = '3';
        } else {
			this.currentMenu_content.style.display = 'none';
            this.currentMenu.style.width = '0px';
			this.currentMenu.style.zIndex = '1'; //if hidden, lwoer the zindex
        }
    }

	process(){
		if(this.stateTrigger['open_div'] == 0){ //if menu close
			this.currTargetEl = null; //to check whatn target click
			this.lastTargetEl = null; //to check when target changed
			this.select_target_el = null //active target, default is curr target, but can be chosen by currselectparentlist
			this.currParentList = null;
			this.currSelectParentList = null;

			this.ui_processor();
		}

		//if select target clicked, next click is target
		if(!this.checkElementAllParentContainArrClassj(this.clsMouseStat.lastElementValidTarget.down,this.clsMouseStat.invalidClass)){ //check if target contain invalid class parent,if not
			this.currTargetEl = this.clsMouseStat.lastElementValidTarget.down;
		}

		if((this.clsMouseStat.click == 1 && this.stateTrigger['select_target'] == 1) || this.stateTrigger['manual_trigger'] == 1){		
			if(this?.lastTargetEl != this?.currTargetEl){ //if target change
				if(!this.checkElementAllParentContainArrClassj(this.currTargetEl,this.clsMouseStat.invalidClass)){ //check if target contain invalid class parent,if not
					this.stateTrigger['change_target'] = 1;
				} else {
					this.currTargetEl = this.lastTargetEl;
				}
			}

			this.process_select_target();

			if(this.select_target_el != null){
				this.stateTrigger['select_target'] = 0;
				this.ui_processor();
			}

			this.stateTrigger['change_target'] = 0;
		}

		//if active change
		if(this.currParentList && this.currSelectParentList){
			if(this.select_target_el != this.currParentList[this.currSelectParentList.value]){
				this.stateTrigger['change_active'] = 1;
				this.ui_processor();
			}
		}

		if(this.stateTrigger['change_active'] == 1){
			if(this.currParentList && this.currSelectParentList){
				this.select_target_el = this.currParentList[this.currSelectParentList.value];
				this.ui_processor();							
			}
		}
		//

	

		this.stateTrigger['change_active'] = 0;
		this.stateTrigger['change_target'] = 0;
		this.stateTrigger['manual_trigger'] = 0;
		this.resizeDisplay();
	}

	process_select_target(){
			//state process
			if(this.stateTrigger['change_target'] == 1){
				this.currParentList = this.getAllParent(this.currTargetEl);
				this.lastTargetEl = this.currTargetEl;
				this.sync_selectTarget_selectOption();
			}
	}

	sync_selectTarget_selectOption(){
		//parent select option (incase the object is stacked and cant click on the div behind it)
		var div_select = this.currentMenu.querySelector('#clsObjectMenu_selectTarget_Select');
		div_select.innerHTML = '';
		if(this.currParentList){
			//make select option
			var selectParent = document.createElement("select");
			for(var pl = 0; pl < Object.keys(this.currParentList).length; pl++){
				var vEl = Object.values(this.currParentList)[pl];
				var optionParent = document.createElement("option");
				
				optionParent.value = pl;
				optionParent.innerHTML = vEl.tagName;
				
				selectParent.appendChild(optionParent);
			}

			div_select.appendChild(selectParent);
			this.currSelectParentList = selectParent;
		} else {
			this.currSelectParentList = null;
		}
	}

	loadComponent(folder){
		/* reset data when load component so its not stacking */
			let objectStorage= this.currentMenu.querySelector('#clsObjectMenu_objectStorage');
			this.component = [];	
			objectStorage.innerHTML="";
		/* end reset data when load component so its not stacking */
		
		Array.from(folder).forEach(file => {
			const reader = new FileReader();

			reader.onload = function(evt) {
				//console.log('File: '+file.name+'');
				//console.log('Content: '+evt.target.result+'');
				this.component.push({'name':file.name,'content':evt.target.result});
				this.displayItemBtn(this.component.length,file.name);
				
			}.bind(this);

			reader.onerror = function(error) {
				console.error('Error reading file '+file.name+'', error);
			};

			reader.readAsText(file); // Read the file as text
		});
	}
	
	selectedObjectProcessor(e){
		var target = e.target;
		var component_name = target.innerHTML;
		var append_type =  this.currentMenu.querySelector('#clsObjectMenu_appendType');

		this.lastSelectedComponent = this.getComponent(component_name);
			var createdComponent = this.createComponentFromString(this.lastSelectedComponent.content);
		
		if(this.select_target_el == null){
			document.body.insertAdjacentElement(append_type.value,createdComponent);
		} else {
			this.select_target_el.insertAdjacentElement(append_type.value,createdComponent);
		}

		this.lastSelectedComponentElement = createdComponent;
	}
	
	displayItemBtn(objIndex,objName){
		let objectStorage= this.currentMenu.querySelector('#clsObjectMenu_objectStorage');
		var el_div = document.createElement("div");
		var el_btn = document.createElement("button");
		
		//create btn
		el_btn.id = objIndex;
		el_btn.innerHTML = objName;
		el_btn.classList.add("objectMenu_itemBtn");
		el_btn.style.width = '100%';
		el_btn.style.wordBreak='break-all';
		el_btn.addEventListener('mousedown',function(e){
			this.selectedObjectProcessor(e);
		}.bind(this));
		
		//append to div, and append to storage div
		el_div.appendChild(el_btn);
		objectStorage.appendChild(el_div);
	}
	
	
	
	getComponent(objName){
		for(var i = 0; i < this.component.length; i++){
			if(this.component[i].name == objName){
				return this.component[i];
			}
		}
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

	checkElementAllParentContainArrClassj(el,objClasslist) { //check if id in list of object
		var all_parent = this.getAllParent(el);
		
		for(var pl=0; pl < Object.keys(all_parent).length;pl++)
		{
			var tmp_parent_el = Object.values(all_parent)[pl];
			for(var ol=0; ol < Object.keys(objClasslist).length;ol++)
			{	
				if(Object.values(objClasslist)[ol]){
					if(tmp_parent_el?.classList?.contains(Object.keys(objClasslist)[ol])){
						return true;
					}
				}
			}
		}
		
		return false;
	}

	getAllParent(el){
		var vcurrElement = el;
		var vparentElement = el;
		var parentList = {};
		
		var layerParent = 0;
		while(vparentElement && layerParent < 10){
			if(vcurrElement === document.documentElement){ //if document element, break ,so it will not cause error
				break;
			}
			parentList[layerParent] = vcurrElement;
		
			vparentElement = vcurrElement.parentElement
			vcurrElement = vparentElement;	
			layerParent++;
		}
		return parentList;
	}

	ui_processor(){ //strictly for ui, dont use for any process
		var ui_classname = 'ui_object_menu';	

		var old_ui_active = document.querySelector('.'+ui_classname);			
		old_ui_active?.classList?.remove(ui_classname);
	
		this.select_target_el?.classList?.add(ui_classname);
	
	}
	
	ui_style(){
		var styleElement = document.createElement('style');
		styleElement.classList.add('clsMainProperties');
		document.head.appendChild(styleElement);
		var styleSheet = styleElement.sheet;
		//this just to help user see the div (optional)
		styleSheet.insertRule(`
			.ui_object_menu{
				min-width:10px;
				min-height:10px;
				background-color:#eeeeee77;
				outline:5px dashed rgb(150,200,255);
			}

			
		`,styleSheet.cssRules.length);	

	}
}

(function(){
	
});