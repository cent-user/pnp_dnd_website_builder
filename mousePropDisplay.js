export default class clsMouseProp {
		constructor(){	
			this.init()
		}
		
		init(){
			this.display();
		}
		
		el(){
			var el = `
			<div id='cstm_mouseProp' 
				style='
					font-size:10px;
					width:200px;
					background-color:#eeeeeeee;
					position:fixed;
					top:1%;
					right:1%;
					pointer-events:none;
					z-index:100;
			'>
				Target = <span id='mpt'></span>
				<br>clientX = <span id='mpcx'></span>
				<br>clientY = <span id='mpcy'></span>
				<br>screenX = <span id='mpsx'></span>
				<br>screenY = <span id='mpsy'></span>
				<br>offsetX = <span id='mpox'></span>
				<br>offsetY = <span id='mpoy'></span>
				<br>pageX = <span id='mppx'></span>
				<br>pageY = <span id='mppy'></span>
			</div>
			`;
			return el;
		}
		
		component_process(){
			var mpt = document.getElementById('mpt');
			var mpcx = document.getElementById('mpcx');
			var mpcy = document.getElementById('mpcy');
			var mpsx = document.getElementById('mpsx');
			var mpsy = document.getElementById('mpsy');
			var mpox = document.getElementById('mpox');
			var mpoy = document.getElementById('mpoy');
			var mppx = document.getElementById('mppx');
			var mppy = document.getElementById('mppy');
			document.addEventListener('mousemove',function(e){
				mpt.innerHTML = e.originalTarget;
				mpcx.innerHTML = e.clientX;
				mpcy.innerHTML = e.clientY;
				mpsx.innerHTML = e.screenX;
				mpsy.innerHTML = e.screenY;
				mpox.innerHTML = e.offsetX;
				mpoy.innerHTML = e.offsetY;
				mppx.innerHTML = e.pageX;
				mppy.innerHTML = e.pageY;
			})
			
			document.addEventListener('scroll',function(e){
				mppx.innerHTML = parseInt(mpcx.innerHTML) + parseInt(window.scrollX);
				mppy.innerHTML = parseInt(mpcy.innerHTML) + parseInt(window.scrollY);
			})
			
			
		}
		
		display(){
			var html = document.getElementsByTagName('html');
			document.body.insertAdjacentHTML("beforeend",this.el());
			this.component_process();
		}
		
	}