export default class clsDragFunctionController{
	constructor(clsMouseStat){
        this.clsMouseStat = clsMouseStat;

        //element
        this.currentMenu = null;

        this.currTargetEl = null;
        this.lastTargetEl = null;
        this.lastEditType = null;
        this.stateTrigger = [];

		//layout properties
		this.currTargetEl_layout_from = null;
		this.lastTargetEl_layout_from = null;
		this.activeTargetEl_layout_from = null;
		this.currParentList_layout_from = null;
		this.currDivElement_layout_from = null

		this.currTargetEl_layout_to = null;
		this.lastTargetEl_layout_to = null;
		this.activeTargetEl_layout_to = null;
		this.currParentList_layout_to = null;
		this.currDivElement_layout_to = null


		this.activeTargetEl_layout_to = null;

        this.menuDisplay();
		this.ui_style();
    }

    menuDisplay(){
        var div = document.createElement("div");
		div.classList.add('clsDragFunctionController');
		div.style.minWidth = '100px';
		div.style.minHeight = '100px';
		div.style.backgroundColor = '#aaddddaa';
		div.style.position = 'fixed';
		div.style.overflow = 'scroll';

		div.style.zIndex = "2";
		this.currentMenu = div;

		document.body.appendChild(div);
    }
    process(){
        try {
            if(!this.checkElementAllParentContainArrClassj(this.clsMouseStat.lastElementValidTarget.down,this.clsMouseStat.invalidClass)){ //check if target contain invalid class parent,if not
		    	this.currTargetEl = this.clsMouseStat.lastElementValidTarget.down;
            }

			//state check
			if(this.lastEditType != this.clsMouseStat.mainProperties.editType){
				this.lastEditType = this.clsMouseStat.mainProperties.editType;
				this.stateTrigger['type_change'] = 1;
			}

            if(this.clsMouseStat.mainProperties.editType == 'dragType_layout'){
                this.process_dragType_layout();
            }

			if(this.stateTrigger['type_change'] == 1 || this.stateTrigger['reset_all'] == 1 ){ //reset menu
				this.currentMenu.innerHTML = "";
		
				//layout properties
				this.currTargetEl_layout_from = null;
				this.lastTargetEl_layout_from = null;
				this.activeTargetEl_layout_from = null;
				this.currParentList_layout_from = null;
				this.currDivElement_layout_from = null
		
				this.currTargetEl_layout_to = null;
				this.lastTargetEl_layout_to = null;
				this.activeTargetEl_layout_to = null;
				this.currParentList_layout_to = null;
				this.currDivElement_layout_to = null

				this.ui_processor();
			}

			if(this.clsMouseStat.mainProperties.editType == 'dragType_layout' || this.clsMouseStat.mainProperties.editType == 'dragType_fixed'){
				this.currentMenu.style.display = 'block';
				this.resizeDisplay();
			} else {
				this.currentMenu.style.display = 'none';
			}


			this.stateTrigger['type_change'] = 0;
			this.stateTrigger['reset_all'] = 0; 
		} catch (error){
			console.error("Caught error in editFunction:", error);
		}
       
    }

    process_dragType_layout(){
		

		if(this.clsMouseStat.click == 1){
			//if el is null and the clicked is not part of plugin
			if(this.currTargetEl_layout_from == null && !this.checkElementAllParentContainArrClassj(this.clsMouseStat.lastElementValidTarget.down,this.clsMouseStat.invalidClass)){
				this.currTargetEl_layout_from =  this.clsMouseStat.lastElementValidTarget.down;
			}

			//if el is null and the clicked is not part of plugin
			if(this.currTargetEl_layout_to == null && !this.checkElementAllParentContainArrClassj(this.clsMouseStat.lastElementValidTarget.down,this.clsMouseStat.invalidClass)){
				this.currTargetEl_layout_to =  this.clsMouseStat.lastElementValidTarget.down;
			}

			if(this.currTargetEl_layout_from != this.lastTargetEl_layout_from){ //if different
				this.stateTrigger['change_target_layout_from'] = 1;
				this.lastTargetEl_layout_from = this.currTargetEl_layout_from;
			} else {
				this.currTargetEl_layout_from = this.lastTargetEl_layout_from;
			}

			if(this.currTargetEl_layout_to != this.lastTargetEl_layout_to){ //if different
				this.stateTrigger['change_target_layout_to'] = 1;
				this.lastTargetEl_layout_to = this.currTargetEl_layout_to;
			} else {
				this.currTargetEl_layout_to = this.lastTargetEl_layout_to;
			}
			
		}

		if(this.currParentList_layout_from && this.currDivElement_layout_from){
			if(this.currDivElement_layout_from.querySelector('select')){
				var layout_from_value = this.currDivElement_layout_from.querySelector('select').value;
				if(this.activeTargetEl_layout_from != this.currParentList_layout_from[layout_from_value]){
					this.stateTrigger['change_active_from'] = 1;
				}
			}
		}

		if(this.currParentList_layout_to && this.currDivElement_layout_to){
			if(this.currDivElement_layout_to.querySelector('select')){
				var layout_to_value = this.currDivElement_layout_to.querySelector('select').value;
				if(this.activeTargetEl_layout_to != this.currParentList_layout_to[layout_to_value]){
					this.stateTrigger['change_active_to'] = 1;
				}
			}
		}
		
		if(this.stateTrigger['change_target_layout_from'] == 1){
			this.currParentList_layout_from = this.getAllParent(this.currTargetEl_layout_from);
		}

		if(this.stateTrigger['change_target_layout_to'] == 1){
			this.currParentList_layout_to = this.getAllParent(this.currTargetEl_layout_to);
		}
		
		if(this.stateTrigger['change_target_layout_from'] == 1 || this.stateTrigger['change_target_layout_to'] == 1){
			this.menu_dragType_layout(this.currParentList_layout_from,this.currParentList_layout_to);
			this.menu_dragType_layout_element_functionality();
		}

		if(this.stateTrigger['change_active_from'] == 1){
			this.activeTargetEl_layout_from = this.currParentList_layout_from[layout_from_value];
		}

		if(this.stateTrigger['change_active_to'] == 1){
			this.activeTargetEl_layout_to = this.currParentList_layout_to[layout_to_value];
		}

		if(this.stateTrigger['change_active_from'] == 1 || this.stateTrigger['change_active_to'] == 1){
			this.ui_processor();
		}
		

		this.stateTrigger['change_target_layout_from'] = 0;
		this.stateTrigger['change_target_layout_to'] = 0;
		this.stateTrigger['change_active_from'] = 0;
		this.stateTrigger['change_active_to'] = 0;
    }

    menu_dragType_layout(json_parentList_from,json_parentList_to){
        this.currentMenu.innerHTML = '';
		var flexDiv = document.createElement("div");
		flexDiv.style.display = "flex";

        //section from
        var selectParent_from = document.createElement("select");
        for(var pl_f = 0; pl_f < Object.keys(json_parentList_from).length; pl_f++){
            var pl_f_e = Object.values(json_parentList_from)[pl_f];
            var opt_pl_f_e = document.createElement("option");
            opt_pl_f_e.value = pl_f;
            opt_pl_f_e.innerHTML = pl_f_e.tagName; ;
            selectParent_from.appendChild(opt_pl_f_e);
        }
		
		var tmp_div_from_section = `
			<div style="width:50%;background-color:red">
				<button id="dragType_layout_from_delete"> X </button>
			</div>
		`;
		var div_from_section = this.createComponentFromString(tmp_div_from_section);
        div_from_section.insertAdjacentElement('afterbegin',selectParent_from);
		


        //section to
        var selectParent_to = document.createElement("select");
        for(var pl_t = 0; pl_t < Object.keys(json_parentList_to).length; pl_t++){
            var pl_t_e = Object.values(json_parentList_to)[pl_t];
            var opt_pl_t_e = document.createElement("option");
            opt_pl_t_e.value = pl_t;
            opt_pl_t_e.innerHTML = pl_t_e.tagName; 
			
            selectParent_to.appendChild(opt_pl_t_e);
        }

		var tmp_div_to_section = `
			<div style="width:50%;background-color:blue">
				<button id="dragType_layout_to_delete"> X </button>
			</div>
		`;
		var div_to_section = this.createComponentFromString(tmp_div_to_section);
        div_to_section.insertAdjacentElement('afterbegin',selectParent_to);
       


		var btn_submit_insertTo = document.createElement('button');
		btn_submit_insertTo.id = "dragType_layout_submit_insertTo";
		btn_submit_insertTo.innerHTML = "Insert To";
		btn_submit_insertTo.style.width = '100%';
		
		flexDiv.appendChild(div_from_section);
		flexDiv.appendChild(div_to_section);
		this.currentMenu.appendChild(flexDiv);
		this.currentMenu.appendChild(btn_submit_insertTo);

		this.currDivElement_layout_from = div_from_section;
		this.currDivElement_layout_to = div_to_section;
		
    }

	menu_dragType_layout_element_functionality(){
		if(this.currDivElement_layout_from){
			var btn_delete_from = this.currDivElement_layout_from.querySelector('#dragType_layout_from_delete');
			btn_delete_from.addEventListener('click',function(){
				this.currDivElement_layout_from.innerHTML = '';
				this.currTargetEl_layout_from = null;
				this.lastTargetEl_layout_from = null;
				this.activeTargetEl_layout_from = null;

			}.bind(this));
		}

		if(this.currDivElement_layout_to){
			var btn_delete_to = this.currDivElement_layout_to.querySelector('#dragType_layout_to_delete');
			btn_delete_to.addEventListener('click',function(){
				this.currDivElement_layout_to.innerHTML = '';
				this.currTargetEl_layout_to = null;
				this.lastTargetEl_layout_to = null;
				this.activeTargetEl_layout_to = null;
			}.bind(this));
		}

		var btn_submit_insertTo = this.currentMenu.querySelector('#dragType_layout_submit_insertTo');
		if(btn_submit_insertTo){
			btn_submit_insertTo.addEventListener('click',function(){
				var cloneNode = this.activeTargetEl_layout_from.cloneNode(true);
				this.activeTargetEl_layout_to.insertAdjacentElement('beforeend',cloneNode);
				this.activeTargetEl_layout_from.remove();

				this.stateTrigger['reset_all'] = 1;
			}.bind(this));
		}
	}

    resizeDisplay(){
		if(this.clsMouseStat.state.smallWindow == 0){
			this.currentMenu.style.width = '50%';
			this.currentMenu.style.height = '30%';
			this.currentMenu.style.left = '25%';
			this.currentMenu.style.bottom = '0px';
        }

        if(this.clsMouseStat.state.smallWindow == 1){
			this.currentMenu.style.top = '';
			this.currentMenu.style.left = '0px';
			this.currentMenu.style.bottom = '0px';
			this.currentMenu.style.width = '100%';
			this.currentMenu.style.height = '50%';
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

	ui_processor(){ //strictly for ui, dont use for any process
		var ui_classname_layout_from = 'ui_edit_function_layout_from';	
		var ui_classname_layout_to = 'ui_edit_function_layout_to';	

		var old_ui_active_from = document.querySelector('.'+ui_classname_layout_from);			
		old_ui_active_from?.classList?.remove(ui_classname_layout_from);
		
		var old_ui_active_to = document.querySelector('.'+ui_classname_layout_to);			
		old_ui_active_to?.classList?.remove(ui_classname_layout_to);

		console.log(this.activeTargetEl_layout_from);
		this.activeTargetEl_layout_from?.classList?.add(ui_classname_layout_from);
		this.activeTargetEl_layout_to?.classList?.add(ui_classname_layout_to);
	
	}
	
	ui_style(){
		var styleElement = document.createElement('style');
		document.head.appendChild(styleElement);
		var styleSheet = styleElement.sheet;
		//this just to help user see the div (optional)
		styleSheet.insertRule(`
			.ui_edit_function_layout_from{
				min-width:10px;
				min-height:10px;
				background-color:#eeeeee77;
				outline:5px dashed rgb(150,200,255);
			}

		`,styleSheet.cssRules.length);	

		styleSheet.insertRule(`
		
			.ui_edit_function_layout_to{
				min-width:10px;
				min-height:10px;
				background-color:#eeeeee77;
				outline:5px dashed rgb(255,200,150);
			}

			
		`,styleSheet.cssRules.length);	
		

		
		
	}

}