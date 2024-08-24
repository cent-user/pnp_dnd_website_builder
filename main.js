import clsObjectStorage from './objectStorage.js';
import clsOptionMenu from './optionMenu.js';
import clsDragFunctionController from './dragFunction.js';
import clsEditFunctionController from './editFunction.js';

import clsMouseProp from './mousePropDisplay.js';

class mouseStat{
	constructor(){
		this.last_target = ''; //get curr target / last target(if leave viewport)	
		this.last_target_parent_anchor = ''; //get parent taht affect last_target positiob offset
		this.last_target_parent_anchor_offset = ''; //get parent taht affect last_target position offset's offset
		
		this.selected_target = ''; //target on mouse down
		
		this.active_target = ''; //target on mouse down and valid
		this.active_target_start_position = {x:0,y:0};; //starting position when target activated
		this.active_target_grab_offset = {x:0,y:0}; //target on mouse down and valid
		this.active_target_parent = ''; //target on mouse down and valid
		
		this.last_active_target = null; //record last active target 
		
		this.active_target_mouse_original_position = {x:0,y:0}; //position of mouse since active target selected
		this.active_target_mouse_offset_position = {x:0,y:0}; //offset of mouse since active target selected

		
		this.clientX = 0;
		this.clientY = 0;
		this.screenX = 0;
		this.screenY = 0;
		this.offsetX = 0;
		this.offsetY = 0;
		this.clientPageX = 0;
		this.clientPageY = 0;
		this.scrollX = 0;
		this.scrollY = 0;
		
		this.validTagElement = 
			{
				"div":true
				,"button":true
				,"p":true
				,"a":true
				,"span":true
				,"h1":true
				,"h2":true
				,"h3":true
				,"h4":true
				,"h5":true
				,"label":true
				,"table":true
				,"input":true
				,"textarea":true
			}
			
		this.validDropTagElement = 
			{
				"div":true
				,"html":true
				,"body":true
			}
			
		this.invalidDragId = //id that cant be drag (use for menu, so it cant be targeted)
			{
				"objectStorage" : true
				,"optionMenu" : true
			}
	}
}

(function(){
	customCSS();
	var vmouseStat = new mouseStat();
	
	var objectStorage = new clsObjectStorage();
	var optionMenu = new clsOptionMenu(vmouseStat);
	var dragFunction_controller = new clsDragFunctionController(vmouseStat);
	var editFunction_controller = new clsEditFunctionController(vmouseStat);

	//var mouseProp = new clsMouseProp();
	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	
	function update(){
		statusProcessor(vmouseStat); //!important
		debugDisplay(vmouseStat); //show hovered element
		dragFunction_controller.main(optionMenu.functionType,optionMenu.dragType); //controller of drag function base od option menu
		editFunction_controller.main(optionMenu.functionType); //controller of edit function base of option menu


	requestAnimationFrame(update.bind(this));
	}
	requestAnimationFrame(update.bind(this));

	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////







	document.addEventListener('mousemove',function(e){
		vmouseStat.last_target = e.target;
		vmouseStat.clientX = e.clientX;
		vmouseStat.clientY = e.clientY;
		vmouseStat.screenX = e.screenX;
		vmouseStat.screenY = e.screenY;
		vmouseStat.offsetX = e.offsetX;
		vmouseStat.offsetY = e.offsetY;
		vmouseStat.scrollX = window.scrollX;
		vmouseStat.scrollY = window.scrollY;
		vmouseStat.clientPageX = parseInt(vmouseStat.clientX) + vmouseStat.scrollX;
		vmouseStat.clientPageY = parseInt(vmouseStat.clientY) + vmouseStat.scrollY;
	});
	
	document.addEventListener('scroll',function(e){
		vmouseStat.scrollX = window.scrollX;
		vmouseStat.scrollY = window.scrollY;
	})
	
/
	document.addEventListener('mousedown',function(e){
		vmouseStat.selected_target = e.target;
		
		if(objectStorage){ //if object from object storage selected, get that object
			if(objectStorage.lastSelectedComponentElement){
				vmouseStat.selected_target = objectStorage.lastSelectedComponentElement;
			}
		}
	});
	
	document.addEventListener('mouseup',function(e){
		vmouseStat.selected_target = '';
		
		if(objectStorage){ //alse reset object storage element if mose up
			objectStorage.lastSelectedComponentElement = null;
			objectStorage.lastSelectedComponent = null;
		}
	});
	
	document.addEventListener('click',function(e){
		/*
		if(vmouseStat.selected_target === ''){ // for switcher
			vmouseStat.selected_target = e.target;
			if(objectStorage){ 
				if(objectStorage.lastSelectedComponentElement){
					vmouseStat.selected_target = objectStorage.lastSelectedComponentElement;
				}
			}
		} else {
			vmouseStat.selected_target = '';
			if(objectStorage){ 
				objectStorage.lastSelectedComponentElement = null;
				objectStorage.lastSelectedComponent = null;
			}
		}*/
	});
	
	function statusProcessor(mouseStat){
		try{
			///////////////////////// make it so when active target dragged, it wont block/highlight text /////////////////
				if(mouseStat.active_target){
					document.body.style.userSelect = "none";
				} else {
					document.body.style.userSelect = "auto";
				}
			/////////////////////////////////////////////////////////////////////////////////////////////
			
			////////////////////////// get active target when user select ///////////////////////////////
				
				if(mouseStat.selected_target && !hasAncestorWithIdObj(mouseStat.selected_target,mouseStat.invalidDragId)){
					if(!(mouseStat.active_target)){ //tag selected must be valid and no active target
					
						mouseStat.active_target = mouseStat.selected_target;
						mouseStat.active_target_grab_offset = {x:vmouseStat.offsetX,y:vmouseStat.offsetY}
						
						mouseStat.active_target = mouseStat.selected_target;
						mouseStat.active_target_start_position = {x:mouseStat.selected_target.style.left || 0,y:mouseStat.selected_target.style.top || 0};
						mouseStat.active_target_grab_offset = {x:vmouseStat.offsetX,y:vmouseStat.offsetY}
					
						mouseStat.active_target_parent = mouseStat.last_target_parent_anchor;
						mouseStat.active_target_mouse_original_position = {x:vmouseStat.clientX,y:vmouseStat.clientY};
						mouseStat.active_target.classList.add('draggable_no_hover'); // make active target unhoverable so we can get dropabble element
					
					}
				} else {
					if(mouseStat.active_target){
						mouseStat.last_active_target = mouseStat.active_target;
						mouseStat.active_target.classList.remove('draggable_no_hover');
						mouseStat.active_target ='';
					}
				}
			/////////////////////////////////////////////////////////////////////////////////////////////
			
			////////////////////////// get parent that affect offset and its offset ///////////////////////////////
				
				var parentAnchor = findParentAnchor(mouseStat.last_target);
			
				if(parentAnchor){
					mouseStat.last_target_parent_anchor = parentAnchor;
					
					var parent_rect = parentAnchor.getBoundingClientRect();

					mouseStat.last_target_parent_anchor = parentAnchor;
					mouseStat.last_target_parent_anchor_offset = {x:parent_rect.left,y:parent_rect.top};
				} else{
					mouseStat.last_target_parent_anchor = '';
					mouseStat.last_target_parent_anchor_offset = {x:0,y:0};
				}
				
			/////////////////////////////////////////////////////////////////////////////////////////////
			
			/////////////////// track active target mouse offset since selected //////////////////////////
				if(mouseStat.active_target){
					mouseStat.active_target_mouse_offset_position = {x:mouseStat.active_target_mouse_original_position.x + -(mouseStat.clientX), y:mouseStat.active_target_mouse_original_position.y + -(mouseStat.clientY)}
				}
			///////////////////////////////////////////////////////////////////////////////////////////////
		} catch (error) {
			//console.log('unexpected error');
		}
	}
	
	function findParentAnchor(velement){
		//find parent which can affect this (child) position
		var vcurrElement = velement;
		var vparentElement = velement;
		var maxLoop = 0;
		
		
		while(vparentElement && maxLoop < 10){
			if(vcurrElement === document.documentElement){ //if document element, break ,so it will not cause error
				break;
			}
		
			vparentElement = vcurrElement.parentElement
			var vparentElement_position = window.getComputedStyle(vparentElement).position;
			if(vparentElement_position !== 'static'){
				return vparentElement;
			}
			
			
			vcurrElement = vparentElement;
			maxLoop++;
		}
		
		return null;
	}
	
	function hasAncestorWithIdObj(element, idObj) { //check if id in list of object
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

	
	function debugDisplay(mouseStat,active=true){
		if(active){
			try{
				var obj = mouseStat.last_target;
				var obj_parent_anchor = mouseStat.last_target_parent_anchor;
				var draggable_hover = document.getElementsByClassName('draggable-hover');
				var parent_anchor = document.getElementsByClassName('parent-anchor');

				//if hover different from listed,remove the last border
				if(draggable_hover[0]){
					if(!(obj === draggable_hover[0])){
						draggable_hover[0].classList.remove('draggable-hover');
						parent_anchor[0].classList.remove('parent-anchor');	
					} 
				}
				
				//apply new hover
				if(!(draggable_hover[0]))
				{
					obj.classList.add('draggable-hover') ;
					obj_parent_anchor.classList.add('parent-anchor');
					
				}
				
			} catch (error) {
				//console.log('unexpected error');
			}
		}
	}
	
	function customCSS(){
		var styleElement = document.createElement('style');
		document.head.appendChild(styleElement);
		styleElement.classList.add('draggable_cstm_css');
		var styleSheet = styleElement.sheet;
		
		//this just to help user see the div (optional)
		styleSheet.insertRule(`
			div{
				min-width:10px;
				min-height:10px;
				background-color:#eeeeee77;
				outline:1px dashed rgb(80,80,80);
			}
		`,styleSheet.cssRules.length);		
		
		styleSheet.insertRule(`
			body{
				min-height:100vh;
			}
		`,styleSheet.cssRules.length);
		
		styleSheet.insertRule(`
			.draggable-hover{
				outline:2px dashed rgb(150,200,255);
			}
		`,styleSheet.cssRules.length);
		
		
		styleSheet.insertRule(`
			.parent-anchor{
				outline:2px dashed rgb(255,50,50);
			}
		`,styleSheet.cssRules.length);	
		
		//zindex 100 so the dragged object always appear on top
		styleSheet.insertRule(`
			.draggable_no_hover{
				pointer-events: none;
				z-index:100;			
			}
		`,styleSheet.cssRules.length);	
		
		
		
		styleSheet.insertRule(`
			#objectStorage{
				pointer-events: none;
				
				& > * {
					pointer-events: auto; /* Enable pointer events for all direct children */
				}
			}
		`,styleSheet.cssRules.length);
		
		styleSheet.insertRule(`
			#optionMenu{
				pointer-events: none;
				
				& > * {
					pointer-events: auto; /* Enable pointer events for all direct children */
				}
			}
		`,styleSheet.cssRules.length);
		
		//unique for cls_opt_menu_export_html must have pointer event so it can be clicked for export
		styleSheet.insertRule(`
			#cls_opt_menu_export_html {			
				pointer-events: auto; !important;
			}
		`,styleSheet.cssRules.length);	
		
		//unique for objectStorage_itemBtn must have pointer event so it can be clicked for export
		styleSheet.insertRule(`
			.objectStorage_itemBtn {			
				pointer-events: auto; !important;
			}
		`,styleSheet.cssRules.length);	
	}
	
		
	
	
	
	function coalesce_null(...arg){
		var retVal;
		
		for(var i = 0; i < arg.length; i++){
			if(!(arg[i] === null || arg[i] === undefined)){
				return arg[i];
			}
		}
	
		return null;
	}
	
	function coalesce_emptyString(...arg){
		var retVal;
		
		for(var i = 0; i < arg.length; i++){
			if(!(arg[i] === null || arg[i] === undefined || arg[i] === '')){
				return arg[i];
			}
		}
	
		return null;
	}
})();