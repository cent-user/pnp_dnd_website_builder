export default class clsObjectStorage{
	constructor(a){
		this.component = [];
		this.lastSelectedComponent = null;
		this.lastSelectedComponentElement = null;
		
		this.customCSS();
		this.main();
		this.processor();
	}
	
	main(){
		document.body.insertAdjacentHTML("afterend",this.storageComponent());
		
		const storageDiv = document.getElementById('objectStorage');
		var script = document.createElement("script");
		script.textContent  = `
			
		`;
		storageDiv.appendChild(script);
	}
	
	storageComponent(){
		var comp = `
			<div id='objectStorage'
				class='lock_drag'
				style='font-size:10px;
				width:100px;
				height:100vh;
				background-color:#eeeeee55;
				position:fixed;
				top:0%;
				left:0%;'
			>
				<div>
					<textarea id="objectStorage_liveComponent_textarea" style="box-sizing: border-box;width:100%"></textarea>
					<button id="objectStorage_liveComponent_getButton">String To Element</button>
				</div>
				<br>
				<div>
					<input id= 'objectStorage_fileSelector' type='file' webkitdirectory multiple />
					<label for='objectStorage_fileSelector'>Load Component</label>
				</div>
				<div id='objectStorage_componentField'>
				
				</div>
			</div>
			
		
			`;
			return comp;
	}
	
	customCSS(){
		var styleElement = document.createElement('style');
		document.head.appendChild(styleElement);
		styleElement.classList.add('draggable_cstm_css');
		var styleSheet = styleElement.sheet;
		
		//style ref : https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/
		styleSheet.insertRule(`
			#objectStorage_fileSelector{
				width: 0.1px;
				height: 0.1px;
				opacity: 0;
				overflow: hidden;
				position: absolute;
				z-index: -1;
				
				&:focus + label , & + label:hover{
					 background-color: red;
					 outline: 1px dotted #000;
				}
				
				& + label {
					font-size: 1.25em;
					font-weight: 700;
					color: white;
					background-color: black;
					display: inline-block;
					padding:3px;
					cursor: pointer; /* "hand" cursor */
				}
				
				& + label * {
					pointer-events: none;
				}
				
				
			}
		`,styleSheet.cssRules.length);

	}
	
	processor(){
		var objectStorage_fileSelector = document.getElementById('objectStorage_fileSelector');
		var objectStorage_liveComponent_getButton = document.getElementById('objectStorage_liveComponent_getButton');
		console.log(objectStorage_liveComponent_getButton);
		/////////////////// file selector inputted, load component list ///////////////////////////////////
			objectStorage_fileSelector.addEventListener('change',function(e){
				var files = e.target.files;
				this.loadComponent(files);
				event.stopPropagation();
			}.bind(this));
		//////////////////////////////////////////////////////////////////////////////////////////////////
		
		/////////////////// if get live component button pressed, realize the inputted component ///////////////////
			objectStorage_liveComponent_getButton.addEventListener('mousedown',function(e){
				var stringForElement = document.getElementById('objectStorage_liveComponent_textarea');
				var createdComponent = this.createComponentFromString(stringForElement.value);
				this.lastSelectedComponentElement = createdComponent;
			}.bind(this));
		//////////////////////////////////////////////////////////////////////////////////////////////////
	}
	
	selectedObjectProcessor(e){
		var target = e.target;
		var component_name = target.innerHTML;

		this.lastSelectedComponent = this.getComponent(component_name);
			var createdComponent = this.createComponentFromString(this.lastSelectedComponent.content);
			
		this.lastSelectedComponentElement = createdComponent;
	}
	
	displayItemBtn(objIndex,objName){
		const objectStorage_componentField = document.getElementById('objectStorage_componentField');
		var el_div = document.createElement("div");
		var el_btn = document.createElement("button");
		
		//create btn
		el_btn.id = objIndex;
		el_btn.innerHTML = objName;
		el_btn.classList.add("objectStorage_itemBtn");
		
		el_btn.addEventListener('mousedown',function(e){
			this.selectedObjectProcessor(e);
		}.bind(this));
		
		//append to div, and append to storage div
		el_div.appendChild(el_btn);
		objectStorage_componentField.appendChild(el_div);
	}
	
	loadComponent(folder){
		/* reset data when load component so its not stacking */
			const objectStorage_componentField = document.getElementById('objectStorage_componentField');
			this.component = [];	
			objectStorage_componentField.innerHTML="";
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

		document.body.appendChild(div);
		
		
	
		return div;
	}
}

(function(){
	
});