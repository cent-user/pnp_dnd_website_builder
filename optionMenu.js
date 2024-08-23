export default class clsOptionMenu{
	constructor(a){
		this.functionType = 0;
		this.dragType = 0;
		this.test3 = "";
		this.optionMenu = "";;
		this.main();
		this.controller();
	}	
	
	optFunctionType() {
		return  [
					{'id':0,'label':'Positioning'}
					,{'id':1,'label':'Layouting'}
					,{'id':2,'label':'editing'}
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
		document.body.insertAdjacentHTML("afterend",this.storageComponent());
		
		this.optionMenu = document.getElementById('optionMenu');
		var script = document.createElement("script");
		script.innerHTML = this.mainScript();
		this.optionMenu.appendChild(script);
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
					
					optionMenu.remove();
					objectStorage.remove();
					customDrag_script_main.remove();
					editFunctioNMenu.remove();
					draggable_cstm_css_arr.forEach(function(e,i){
						e.remove();
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
	
}

(function(){

})();
