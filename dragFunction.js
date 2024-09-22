export default class clsDragFunctionController{
	constructor(clsMouseStat){
        this.clsMouseStat = clsMouseStat;

        //element
        this.currentMenu = null;

        this.currTargetEl = null;
        this.lastTargetEl = null;
        this.lastEditType = null;
        this.stateTrigger = [];

        this.menuDisplay();
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
            if(this.clsMouseStat.mainProperties.editType == 'dragType_layout' || this.clsMouseStat.mainProperties.editType == 'dragType_fixed'){
                this.currentMenu.style.display = 'block';
            } else {
                this.currentMenu.style.display = 'none';
            }

            if(!this.checkElementAllParentContainArrClassj(this.clsMouseStat.lastElementValidTarget.down,this.clsMouseStat.invalidClass)){ //check if target contain invalid class parent,if not
		    	this.currTargetEl = this.clsMouseStat.lastElementValidTarget.down;
            }

			//state check
			if(this.lastEditType != this.clsMouseStat.mainProperties.editType){
				this.lastEditType = this.clsMouseStat.mainProperties.editType;
				this.stateTrigger['type_change'] = 1;
			}

			if(this.lastTargetEl != this.currTargetEl){ //if target change
					this.stateTrigger['change_target'] = 1;
			}
			
			if(this.currParentList && this.currSelectParentList){
				if(this.activeTargetEl != this.currParentList[this.currSelectParentList.value]){
					this.stateTrigger['change_active'] = 1;
				}
			}

            if(this.clsMouseStat.mainProperties.editType == 'dragType_layout'){
                this.process_dragType_layout();
            }

			this.stateTrigger['type_change'] = 0;
			this.stateTrigger['change_target'] = 0;
			this.stateTrigger['change_active'] = 0;
		} catch (error){
			console.error("Caught error in editFunction:", error);
		}
       
    }

    process_dragType_layout(){

       if(this.stateTrigger['change_target'] == 1){
          
            this.currParentList = this.getAllParent(this.currTargetEl);
            this.lastTargetEl = this.currTargetEl;
            this.menu_dragType_layout();
       }

        if(this.stateTrigger['change_active'] == 1){
            if(this.currParentList && this.currSelectParentList){
                this.activeTargetEl = this.currParentList[this.currSelectParentList.value];
            }
        }

        
    }

    menu_dragType_layout(){
        this.currentMenu.innerHTML = '';
        
        //section from
        var selectParent = document.createElement("select");
        for(var pl = 0; pl < Object.keys(this.currParentList).length; pl++){
            var vEl = Object.values(this.currParentList)[pl];
            var optionParent = document.createElement("option");
            optionParent.value = pl;
            optionParent.innerHTML = vEl.tagName; 
            selectParent.appendChild(optionParent);
        }

        
        //section to
        var div_from_section = `
            <div style="width:100px;height:100px;background-color:red">

            </div>
        `;
        var el_div_from_section = this.createComponentFromString(div_from_section);
        el_div_from_section.appendChild(selectParent);
        this.currentMenu.appendChild(el_div_from_section);


        var selectParent = document.createElement("select");
        for(var pl = 0; pl < Object.keys(this.currParentList).length; pl++){
            var vEl = Object.values(this.currParentList)[pl];
            var optionParent = document.createElement("option");
            optionParent.value = pl;
            optionParent.innerHTML = vEl.tagName; 
            selectParent.appendChild(optionParent);
        }

        var div_from_section = `
            <div style="width:100px;height:100px;background-color:blue">

            </div>
        `;

        var el_div_from_section = this.createComponentFromString(div_from_section);
        el_div_from_section.appendChild(selectParent);
       
        this.currentMenu.appendChild(el_div_from_section);
    }

    resizeDisplay(){

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

}