export default class clsOptionMenu{
	constructor(pmouseStat){
		this.mouseStat = pmouseStat;
		this.functionType = 0;
		this.dragType = 0;
		this.test3 = "";
		this.thisElement = null;

		this.main();
		this.controller();
	}	
	
	optFunctionType() {
		return  [
					{'id':0,'label':'Positioning'}
					,{'id':1,'label':'Layouting'}
					,{'id':2,'label':'editing'}
					,{'id':3,'label':'delete'}
				];
	}
	
	optDragType() {
		return  [
					{'id':0,'label':'Position'}
					,{'id':1,'label':'Margin'}
				];
	}
	
	main(){
		////////////////////////// /display component and script //////////////////////////////////////
		this.thisElement = this.createComponentFromString(this.storageComponent());
		document.body.appendChild(this.thisElement);	
		
		var script = document.createElement("script");
		script.innerHTML = this.mainScript();
		this.thisElement.appendChild(script);
		///////////////////////////////////////////////////////////////////////////////////////////////
	}

	mainScript(){
		return `
		var cls_opt_menu_export_html = document.getElementById('cls_opt_menu_export_html');
			cls_opt_menu_export_html.addEventListener('click',function(){
				var originalScript = document.getElementById('customDrag_script_main');
				exportHTML();
				addMainJs(originalScript.src);
			});
			
			 function escapeHtml(html) {
            return html.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;')
                       .replace(/"/g, '&quot;')
                       .replace(/'/g, '&#039;');		 
			}
			
			function exportHTML(){
					var optionMenu = document.getElementById('optionMenu');
					var objectStorage = document.getElementById('objectStorage');
					var customDrag_script_main = document.getElementById('customDrag_script_main');
					var editFunctioNMenu = document.getElementById('editFunctioNMenu');
					
					var draggable_cstm_css = document.getElementsByClassName('draggable_cstm_css');		
					var draggable_cstm_css_arr = Array.from(draggable_cstm_css);
					
					if(optionMenu){
						optionMenu.remove();
					}
					if(objectStorage){
						objectStorage.remove();
					}
					if(customDrag_script_main){
						customDrag_script_main.remove();
					}
					if(editFunctioNMenu){
						editFunctioNMenu.remove();
					}
					draggable_cstm_css_arr.forEach(function(e,i){
						if(e){
							e.remove();
						}
					})
					
					var modifiedHtml = document.documentElement.outerHTML;

					
					 var newWindow = window.open('', '', 'width=800,height=600');
						newWindow.document.open();
						newWindow.document.write('<html><head><title>HTML Source Code</title></head><body>');
						newWindow.document.write('<pre>' + escapeHtml(modifiedHtml) + '</pre>');
						newWindow.document.write('</body></html>');
						newWindow.document.close();
			}
			
			function addMainJs(src){
				var script = document.createElement('script');
			
				script.id = 'customDrag_script_main';
				script.type = 'module';
				script.src = src+'?cachebuster='+ new Date().getTime();
				
				script.addEventListener("load", () => {
					console.log("File loaded")
				});

				script.addEventListener("error", (ev) => {
					console.log("Error on loading file", ev);
				});


				document.body.appendChild(script);
			}			
		`
	}
	
	storageComponent(){
		var functionType = this.optMaker(this.optFunctionType(),'optMenu_function_Type');
		var dragType = this.optMaker(this.optDragType(),'optMenu_drag_type');
		var comp = `
			<div id='optionMenu'
				style='
					font-size:10px;
					width:100px;
					height:100vh;
					background-color:#eeeeee55;
					position:fixed;
					top:0%;
					right:0%;
			'>
				<div>
					<fieldset class="cls_opt_menu_function">
						<legend>Function</legend>
						${functionType}
					</fieldset>
					
					<fieldset class="cls_opt_menu_drag_type">
						<legend>Drag Type</legend>
						${dragType}
					</fieldset>
				</div>
				<div>
					<button id='cls_opt_menu_export_html'>Export</button>
				</div>
			</div>
			
		
			`;
			return comp;
	}
	
	controller(){
		document.addEventListener('change',function(e){
			var target = e.target;
			
			if(target.name== "optMenu_drag_type"){
				this.dragType = target.value;
			}
			
			if(target.name== "optMenu_function_Type"){
				this.functionType = target.value;
			}

		}.bind(this));
		
	}
	
	optMaker(arr,name){
		var retStr = '';
		for(var i = 0; i < arr.length; i++){
			retStr += `<label>${arr[i].label} : <input type='radio' name='${name}' value='${arr[i].id}'/></label>`
		}

		return retStr;
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

	hasAncestorWithIdObj_strict(element, idObj) { //check if id in list of object
		// Traverse up the DOM tree
		if(element === document.documentElement || element === document.body){ //if html or body, return true ,so it will not cause error
			return false;
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

(function(){

})();
