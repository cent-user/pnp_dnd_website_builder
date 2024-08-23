export default class clsDragFunctionController{
	constructor(pmouseStat){
		this.mouseStat = pmouseStat;
		this.currTarget = null;
		this.currTarget_original_pos = {x:0,y:0};
		this.currTarget_original_parent = null;
		this.dropTarget = null;
	}
	
	main(function_type = 0,drag_type = 0){
		if(function_type==0){	this.dragObject(this.mouseStat,drag_type,true);	}
		if(function_type==1){	this.dragObject_layouting(this.mouseStat,true);	}
	}
	
	dragObject(mouseStat,drag_type,active=false){
	// run if active and tag is valid

		if(active){
			try{
				if(drag_type == 0) { //if drag type position
					
						if(mouseStat.active_target_parent){
							var anchor_pos_x = parseInt(mouseStat.active_target_start_position.x) + mouseStat.scrollX || 0;
							var anchor_pos_y = parseInt(mouseStat.active_target_start_position.y) + mouseStat.scrollY || 0;
						} else {
							var anchor_pos_x = (mouseStat.active_target_mouse_original_position.x - mouseStat.active_target_grab_offset.x) + mouseStat.scrollX;
							var anchor_pos_y = (mouseStat.active_target_mouse_original_position.y - mouseStat.active_target_grab_offset.y) + mouseStat.scrollY;
						}
						
						mouseStat.active_target.style.position 	= this.coalesce_emptyString(mouseStat.active_target.style.position,'absolute');
						mouseStat.active_target.style.left 		= anchor_pos_x + -(mouseStat.active_target_mouse_offset_position.x)+'px';
						mouseStat.active_target.style.top 		= anchor_pos_y + -(mouseStat.active_target_mouse_offset_position.y)+'px';
					
				}
				
				if(drag_type == 1) { //if drag type margin
				
				}
				
			} catch (error) {
				//console.log('unexpected error');
			}
			
		}
	}
	
	dragObject_layouting(mouseStat,active=false){
	// run if active and tag is valid
		if(active){
			
			try{
				if(mouseStat.active_target){
					
						this.currTarget 				= mouseStat.active_target; //record active target
						this.currTarget_original_parent = this.currTarget.parentNode //record active target
						this.currTarget_original_pos 	= mouseStat.active_target_start_position; //record active target original pos
						
						//record valid drop target
						if(mouseStat.validDropTagElement[mouseStat.last_target.tagName.toLowerCase()]){
							this.dropTarget = mouseStat.last_target;
						} else {
							this.dropTarget = null;
						}
						
						mouseStat.active_target.style.position 	= 'fixed';
						mouseStat.active_target.style.left 		= ((mouseStat.active_target_mouse_original_position.x) + -(mouseStat.active_target_mouse_offset_position.x))+'px';
						mouseStat.active_target.style.top 		= ((mouseStat.active_target_mouse_original_position.y) + -(mouseStat.active_target_mouse_offset_position.y))+'px';
					
				} else { //when no active object (object dropped)
					if(this.currTarget == mouseStat.last_active_target){
						//check which part of dropzone being hover to drop
						if(this.dropTarget){
							this.currTarget.style.removeProperty('position');
							this.currTarget.style.removeProperty('left');
							this.currTarget.style.removeProperty('top');
							this.currTarget.style.removeProperty('right');
							this.currTarget.style.removeProperty('bottom');
							this.dropTarget.appendChild(this.currTarget);
						} else {
							this.currTarget.style.removeProperty('position');
							this.currTarget.style.left 		= this.currTarget_original_pos.x+'px';
							this.currTarget.style.top 		= this.currTarget_original_pos.y+'px';
						}
						
						//reset currTarget (to simulate drop)
						this.currTarget = null;
						this.currTarget_original_pos = null;
					}
				}
				
			} catch (error) {
				//console.log('unexpected error');
			}
			
		}
	}
	
	coalesce_emptyString(...arg){
		var retVal;
		
		for(var i = 0; i < arg.length; i++){
			if(!(arg[i] === null || arg[i] === undefined || arg[i] === '')){
				return arg[i];
			}
		}
	
		return null;
	}
}

	
(function(){
	
})();