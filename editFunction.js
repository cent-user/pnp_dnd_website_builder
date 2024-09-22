export default class clsEditFunctionController{
	constructor(clsMouseStat){
		this.clsMouseStat = clsMouseStat;
		
		//dom tree element
		this.currentMenu = null; 
		this.currSelectParentList = null;
		this.currTableAttrList = null;
		
		//state element
		this.currTargetEl = null; //to check whatn target click
		this.lastTargetEl = null; //to check when target changed
		this.activeTargetEl = null //active target, default is curr target, but can be chosen by currselectparentlist
		this.lastMenuPos = {'top':0,'left':0};
		this.currParentList = null;
		this.stateTrigger = [];
		this.lastEditType = null;

		
		
		this.menuDisplay();
		this.ui_style();
		
	}
	
	process(){
		try {
			
			this.currTargetEl = this.clsMouseStat.lastElementValidTarget.down;
			
			//state check
			if(this.lastEditType != this.clsMouseStat.mainProperties.editType){
				this.lastEditType = this.clsMouseStat.mainProperties.editType;
				this.stateTrigger['type_change'] = 1;
			}

			if(this?.lastTargetEl != this?.currTargetEl){ //if target change
				if(!this.checkElementAllParentContainArrClassj(this.currTargetEl,this.clsMouseStat.invalidClass)){ //check if target contain invalid class parent,if not
					this.stateTrigger['change_target'] = 1;
				} else {
					this.currTargetEl = this.lastTargetEl;
				}
			}
			
			if(this.currParentList && this.currSelectParentList){
				if(this.activeTargetEl != this.currParentList[this.currSelectParentList.value]){
					this.stateTrigger['change_active'] = 1;
				}
			}

			//ui process
			if(this.currTargetEl == null 
				|| this.currTargetEl.tagName == 'HTML' 
				|| this.clsMouseStat.lastElementValidTarget.down.id == 'clsEditFunctionController_close' 
				|| this.stateTrigger['type_change'] == 1
			){
				
					this.currentMenu.style.display = 'none';
					this.currentMenu.innerHTML = '';
					this.lastTargetEl = null;
					this.activeTargetEl = null;
					this.currParentList = null;
					this.ui_processor();
				
			} else {
				if(this.clsMouseStat.mainProperties.editType == 'editType_css' || this.clsMouseStat.mainProperties.editType == 'editType_js'){
					this.currentMenu.style.display = 'block';
				}
			}
			
			if(this.clsMouseStat.mainProperties.editType == 'editType_css'){
				this.process_editType_css();
			}
			

			this.stateTrigger['type_change'] = 0;
			this.stateTrigger['change_target'] = 0;
			this.stateTrigger['change_active'] = 0;
		} catch (error){
			console.error("Caught error in editFunction:", error);
		}
	}
	
	process_editType_css(){
		//state process
		if(this.stateTrigger['change_target'] == 1){
			this.currParentList = this.getAllParent(this.currTargetEl);
			this.lastTargetEl = this.currTargetEl;
			this.menuContentDisplay();
			this.syncContentDisplay();
			//this.syncMenuDisplayReposition();
		}
		
		if(this.stateTrigger['change_active'] == 1){
			if(this.currParentList && this.currSelectParentList){
				this.activeTargetEl = this.currParentList[this.currSelectParentList.value];
				this.ui_processor();		
				this.syncContentDisplay();
				
			}
		}
		
		if(this.activeTargetEl){
				this.resizeDisplay();
				this.syncContentDisplayToElement();	
		}

	}
	
	menuDisplay(){
		//component div
		var div = document.createElement("div");
		div.classList.add('clsEditFunctionController');
		div.style.minWidth = '100px';
		div.style.minHeight = '100px';
		div.style.backgroundColor = '#aaddddaa';
		div.style.position = 'fixed';
		div.style.overflow = 'scroll';

		div.style.zIndex = "2";
		this.currentMenu = div;
		document.body.appendChild(div);
	}
	
	resizeDisplay(){
		if(this.clsMouseStat.state.smallWindow == 0){
			this.currentMenu.style.width = '50%';
			this.currentMenu.style.height = '30%';
			this.currentMenu.style.left = '25%';
			this.currentMenu.style.bottom = '0px';
			

			//this.currentMenu.style.top = this.lastMenuPos.top;
			//this.currentMenu.style.left = this.lastMenuPos.left;
			/*
			var all_child_el = this.currentMenu.querySelectorAll('input,textarea,select,button');
			all_child_el.forEach(element => {
				element.style.fontSize = '1em';
			});*/
        }

        if(this.clsMouseStat.state.smallWindow == 1){
			this.currentMenu.style.top = '';
			this.currentMenu.style.left = '0px';
			this.currentMenu.style.bottom = '0px';
			this.currentMenu.style.width = '100%';
			this.currentMenu.style.height = '50%';

			/*
			var all_child_el = this.currentMenu.querySelectorAll('input,textarea,select,button');
			all_child_el.forEach(element => {
				element.style.fontSize = '2.5em';
			});
			*/
		}
	}
	
	menuContentDisplay(){
		//parent select option (incase the object is stacked and cant click on the div behind it)
		this.currentMenu.innerHTML = '';
		if(this.currParentList){
			//header div (for sticky)
			var headerDiv =  document.createElement("div");
			headerDiv.style.position = "sticky";
			headerDiv.style.top = "0px";
			headerDiv.style.zIndex = "2";
			//make select option
			var selectParent = document.createElement("select");
			for(var pl = 0; pl < Object.keys(this.currParentList).length; pl++){
				var vEl = Object.values(this.currParentList)[pl];
				var optionParent = document.createElement("option");
				
				optionParent.value = pl;
				optionParent.innerHTML = vEl.tagName;
				
				selectParent.appendChild(optionParent);
			}
		
			//make close button
			var btnClose = document.createElement("button");
			btnClose.innerHTML = 'X'
			btnClose.id = 'clsEditFunctionController_close';
		
			//make input field
			var attrTable = document.createElement('table'); 
			var attrTableBody = document.createElement('tbody'); 
			
			attrTable.append(attrTableBody);
			headerDiv.appendChild(selectParent);
			headerDiv.appendChild(btnClose);
			this.currentMenu.appendChild(headerDiv);
			this.currentMenu.appendChild(attrTable);
			

			if(this.clsMouseStat.state.smallWindow == 0){
				//if big screen/desktop
				selectParent.style.width = '80%';
				selectParent.style.height = '10%';
				
				btnClose.style.width = '20%';
				btnClose.style.height = '10%';
				
				attrTable.style.position = 'relative';
				attrTable.style.width = '100%'; 

			}
			
			if(this.clsMouseStat.state.smallWindow == 1){
				//if small screen/mobile
				headerDiv.style.height = '10%';

				selectParent.style.width = '80%';
				selectParent.style.height = '100%';
				
				btnClose.style.width = '20%';
				btnClose.style.height = '100%';
				
				attrTable.style.width = '100%'; 
			}
			
			this.currSelectParentList = selectParent;
			this.currTableAttrList = attrTable;
		} else {
			this.currSelectParentList = null;
		}
	}
	
	/*
	syncMenuDisplayReposition(){
		if(this.clsMouseStat.state.smallWindow == 0){
			let top_offset;
			let left_offset;
			if(this.clsMouseStat.mouseAtSection.down == 1){
				top_offset =  parseInt(this.currentMenu.clientHeight,10);
				
			} else {
				top_offset = 0;
			}
			
			if(this.clsMouseStat.mouseAtSection.right == 1){
				left_offset =  parseInt(this.currentMenu.clientWidth,10);
				console.log(left_offset);
			} else {
				left_offset = 0;
			}
			this.currentMenu.style.top = this.clsMouseStat.page.y - top_offset +'px';
			this.currentMenu.style.left = this.clsMouseStat.page.x - left_offset +'px';

			this.lastMenuPos.top = this.currentMenu.style.top;
			this.lastMenuPos.left = this.currentMenu.style.left;
		}
	}*/

	syncContentDisplay(){
		if(this.activeTargetEl){
			var tbody = this.currTableAttrList.querySelector('tbody');
			tbody.innerHTML = '';
			var attributes = this.activeTargetEl.attributes;
			for(var i = 0; i < attributes.length;i++){
				var localname = attributes[i].localName;
				this.addContentDisplayRow(localname,attributes[i].nodeValue);
			}

			if(attributes.length == 0){
				this.addContentDisplayRow();
			}
		}
	}

	addContentDisplayRow(localname_value='',value_value=''){
		var tbody = this.currTableAttrList.querySelector('tbody');

		let tr_node = document.createElement('tr');
		let td_node_localname = document.createElement('td');
		let td_node_value = document.createElement('td');
		let input_node_localname = document.createElement('input');
		let input_node_value = document.createElement('textarea');

		td_node_localname.style.width = '50%';
		td_node_value.style.width = '50%';

		input_node_localname.style.width = '98%';
		input_node_value.style.width = '98%';

		td_node_localname.append(input_node_localname);
		td_node_value.append(input_node_value);

		tr_node.append(td_node_localname);
		tr_node.append(td_node_value);

		input_node_localname.value=localname_value;
		input_node_value.value=value_value;

		tbody.append(tr_node);

		if(this.clsMouseStat.state.smallWindow == 0){
			//if big screen/desktop

		}

		if(this.clsMouseStat.state.smallWindow == 1){
			//if small screen/mobile
			input_node_localname.style.position = 'relative';
			input_node_localname.style.height = '5%';
			input_node_value.style.position = 'relative';
			input_node_value.style.height = '5%';
		}
	}

	syncContentDisplayToElement(){
		var tbody = this.currTableAttrList.querySelector('tbody');
		var rows = tbody.querySelectorAll('tr');
		var avaiable_attribute = [];
		for(var i = 0; i< rows.length;i++){
			var localname_el = rows[i].querySelector('input');
			var value_el = rows[i].querySelector('textarea');

			if(localname_el.value && document.activeElement != localname_el){
				avaiable_attribute.push(localname_el.value.toLowerCase());
				this.activeTargetEl.setAttribute(localname_el.value.toLowerCase(),value_el.value);
			}
		}

		//get attribute that deleted,remove it
		var avaiable_active_attr = []
		var active_target_avaiable_attribute = Object.values(this.activeTargetEl.attributes);
		active_target_avaiable_attribute.forEach(attr =>{
			avaiable_active_attr.push(attr.name)
		})
		var lost_attributes = avaiable_active_attr.filter(attr => !avaiable_attribute.includes(attr));

		lost_attributes.forEach(lost =>{
			this.activeTargetEl.removeAttribute(lost);
		})

		// if last row empty, add new row
		var rows = this.currTableAttrList.querySelector('tbody').querySelectorAll('tr')
		let lastRow = rows[rows.length - 1]
		let lastRow_localname_el = lastRow.querySelector('input');
		let lastRow_value_el = lastRow.querySelector('textarea');
		if(lastRow_localname_el?.value != '' || lastRow_value_el?.value !=''){
			this.addContentDisplayRow();
		}
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
	
	checkElementContainArrClass(el,arrClass){
		var flagTrue = 0;
		arrClass.forEach((vclassname, index) => {
			if(el.classList.contains(vclassname)){
				flagTrue = 1;
				
			}
		});
		
		if(flagTrue == 1){
			return true;
		} else {
			return false;
		}
		
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
	
	ui_processor(){ //strictly for ui, dont use for any process
		var ui_classname = 'ui_edit_function';	

		var old_ui_active = document.querySelector('.'+ui_classname);			
		old_ui_active?.classList?.remove(ui_classname);
	
		this.activeTargetEl?.classList?.add(ui_classname);
	
	}
	
	ui_style(){
		var styleElement = document.createElement('style');
		document.head.appendChild(styleElement);
		var styleSheet = styleElement.sheet;
		//this just to help user see the div (optional)
		styleSheet.insertRule(`
			.ui_edit_function{
				min-width:10px;
				min-height:10px;
				background-color:#eeeeee77;
				outline:5px dashed rgb(150,200,255);
			}

			
		`,styleSheet.cssRules.length);	
		

		
		
	}
}