export default class clsFileToString{
	constructor(file_path){
		this.string='';
		
		var self  = this;
		
		const req = new XMLHttpRequest();
		
		req.addEventListener("load", reqListener);
		req.open("POST", file_path);
		req.send();
		
		function reqListener(){
			console.log(this.string);
			console.log(this.responseText);
			this.string = this.responseText;
		}
	}
}

