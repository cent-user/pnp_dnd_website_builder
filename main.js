import clsMainProperties from './mainProperties.js'
import clsPropertyDisplayer from './classPropertyDisplayer.js';
import clsEditFunctionController from './editFunction.js';
import clsDragFunctionController from './dragFunction.js';
import clsObjectMenu from './objectMenu.js';
import clsExportHtmlMenuController from './exportHtmlMenu.js';

class mouseStat {
	constructor(){
		this.click = 0;
		this.client = {x:0,y:0} 
		this.screen = {x:0,y:0} 
		this.page = {x:0,y:0} 
		this.lastElementTarget = {down:null,up:null} //if touch, up can be not consistent when moved, use down
		this.invalidClass = //element with this class mean the element is part of plugin, will be removed when exported
			{
				'clsPropertyDisplayer':true
				,'clsEditFunctionController':true
				,'clsMainProperties':true
				,'clsDragFunctionController':true
				,'clsObjectMenu':true
				,'jsl_plugin_main_script':true
			}
			
		//process element
		this.lastElementValidTarget = {down:null,up:null}; //if down is valid, isnert here
		this.state = 
			{
				'smallWindow' : 0
			}
		this.mouseAtSection = 
			{
				'up' : 1
				,'down' : 1
				,'left' : 0
				,'right' : 0
			}
			this.mainProperties = 
			{
				'editType':'editType_css'
			};
	}
}

(function(){
	let clsMouseStat = new mouseStat();
	let clsEditFunction = new clsEditFunctionController(clsMouseStat);
	let clsDragFunction = new clsDragFunctionController(clsMouseStat);
	let clsObjectMenuv = new clsObjectMenu(clsMouseStat);
	let clsMainPropertiesMenu = new clsMainProperties(clsMouseStat)
	let clsExportHtmlMenu = new clsExportHtmlMenuController(clsMouseStat)
	
	
	//let display_clsMouseStat = new clsPropertyDisplayer(clsDragFunction);
	
	syncMouseEvent(clsMouseStat);
	ui_style();
	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	function update(){
		clsMainPropertiesMenu.process();
		clsObjectMenuv.process();
		clsExportHtmlMenu.process();
		clsMouseStat.mainProperties.editType = clsMainPropertiesMenu.editType_checked;
		
		statusProcessor(clsMouseStat);
		clsEditFunction.process();
		clsDragFunction.process();
		//display_clsMouseStat.syncMenu();
		
		clsMouseStat.click = 0;
		requestAnimationFrame(update.bind(this));
	}
	requestAnimationFrame(update.bind(this));
	
	function statusProcessor(clsMouseStat){
		//valid down target
		clsMouseStat.lastElementValidTarget = clsMouseStat.lastElementTarget;
		
		//check if its small window (mobile) or not
		if( window.innerWidth < 768 || screen.width < 768 ){
			clsMouseStat.state.smallWindow = 1;
		} else {
			clsMouseStat.state.smallWindow = 0;
		}
		
		//check if mouse is currently on what section
		if(screen.width/2 > clsMouseStat.client.x){
			clsMouseStat.mouseAtSection.left = 1;
			clsMouseStat.mouseAtSection.right = 0;
		}
		
		if(screen.width/2 < clsMouseStat.client.x){
			clsMouseStat.mouseAtSection.left = 0;
			clsMouseStat.mouseAtSection.right = 1;
		}
		
		if(screen.height/2 < clsMouseStat.client.y){
			clsMouseStat.mouseAtSection.up = 0;
			clsMouseStat.mouseAtSection.down = 1;
		}
		
		if(screen.height/2 > clsMouseStat.client.y){
			clsMouseStat.mouseAtSection.up = 1;
			clsMouseStat.mouseAtSection.down = 0;
		}

	}

	function ui_style(){
		var styleElement = document.createElement('style');
		document.head.appendChild(styleElement);
		var styleSheet = styleElement.sheet;
		//this just to help user see the div (optional)
		styleSheet.insertRule(`
			.clsPropertyDisplayer , .clsEditFunctionController ,.clsMainProperties ,.clsDragFunctionController{
				pointer-events:none;

				& * {
					pointer-events:auto;
				}
			}

			
		`,styleSheet.cssRules.length);	
	}
	///////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	
	
	
	
	
	function syncMouseEvent (clsMouseStat){
		//because mobile dont have mousemove like desktop, avoid if possible
		
		// move
			document.addEventListener('mousemove',function(e){
				clsMouseStat.client = {'x':e.clientX,'y':e.clientY};
				clsMouseStat.screen = {'x':e.screenX,'y':e.screenY};
				clsMouseStat.page = {'x':e.pageX,'y':e.pageY};
			});
			
			document.addEventListener('touchmove',function(e){
				clsMouseStat.client = {'x':e.touches[0].clientX,'y':e.touches[0].clientY};
				clsMouseStat.screen = {'x':e.touches[0].screenX,'y':e.touches[0].screenY};
				clsMouseStat.page = {'x':e.touches[0].pageX,'y':e.touches[0].pageY};
				
			});
		//
		
		//after touchstart, it will also trigget mousedown, so use mousedown should be enough
		//down
			document.addEventListener('mousedown',function(e){
				clsMouseStat.client = {'x':e.clientX,'y':e.clientY};
				clsMouseStat.screen = {'x':e.screenX,'y':e.screenY};
				clsMouseStat.page = {'x':e.pageX,'y':e.pageY};
				
				clsMouseStat.lastElementTarget.down = e.target;
				clsMouseStat.click = 1;		
			});
			
			document.addEventListener('touchstart',function(e){
				
			});
		//
		
		//after touchend, it will also trigget mouseup, so use mouseup should be enough
		//up
			document.addEventListener('mouseup',function(e){
				clsMouseStat.client = {'x':e.clientX,'y':e.clientY};
				clsMouseStat.screen = {'x':e.screenX,'y':e.screenY};
				clsMouseStat.page = {'x':e.pageX,'y':e.pageY};
				
				clsMouseStat.lastElementTarget.up = e.target;
			});
			
			document.addEventListener('touchend',function(e){
				
				
				
			});
		//
		
	}
})();