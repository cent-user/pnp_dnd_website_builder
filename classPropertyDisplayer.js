export default class clsPropertyDisplayer{
	constructor(targetClsMenu){
		this.targetCls = targetClsMenu
		this.currentMenu = null;
		
		this.main();
	}
	
	main() {
		this.menuDisplay();
		this.syncMenu();
	}
	
	menuDisplay(){
		var div = document.createElement("div");
		div.classList.add('clsPropertyDisplayer');
		div.style.backgroundColor = 'white';
		
		this.currentMenu = div;
		document.body.appendChild(div);
	}
	
	syncMenu(){
		var div = this.currentMenu;
		var content_json = this.targetCls;
		
		div.innerHTML = '';
		for(var i = 0;i < Object.keys(content_json).length;i++){
			var key =  JSON.stringify(Object.keys(content_json)[i]);
			var value = JSON.stringify(Object.values(content_json)[i]);
			
			div.innerHTML = div.innerHTML + '<br> ' + key + ' : ' +  value;
		}
		
	}
}