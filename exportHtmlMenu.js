export default class clsExportHtmlMenuController{
    constructor(clsMouseStat){
        this.clsMouseStat = clsMouseStat;

        //dom tree element
		this.currentMenu = null; 
        this.currentMenu_content = null;
        this.stateTrigger = [];
		this.stateTrigger['open_div'] = true;

		this.menuDisplay();
        this.menuDisplay_functionality();
    }

    process(){
        this. resizeDisplay();
     }

    menuDisplay(){
        var div = document.createElement('div');
        div.classList.add('clsMainProperties');
        div.style.backgroundColor = '#aaddddaa';
        div.style.position = "fixed";
        div.style.zIndex = '1';
        
        var tmp_div = `
				<div class="clsMainProperties_divContent">
                    <button id="mainProperties_exportHtml_btn" style="width:100%">Export HTML</button>
                    <button id="mainProperties_saveHTML_btn" style="width:100%">Save HTML</button>
                    <button id="mainProperties_loadHTML_btn" style="width:100%">Load HTML</button>
                    <button id="mainProperties_deleteSavedHTML_btn" style="width:100%">Delete Saved HTML</button>
				</div>
			`;
		var div_content = this.createComponentFromString(tmp_div);
	   
        //open / close menu
        var div_btn_open_close = document.createElement('button');
        div_btn_open_close.style.width = '50px';
        div_btn_open_close.style.height = '20px';
        div_btn_open_close.style.backgroundColor = '#aaffaa';
        div_btn_open_close.style.position = 'relative';
        div_btn_open_close.style.left = '-50px';
        div_btn_open_close.style.top = '40px';
        div_btn_open_close.innerHTML = 'Export';
        div_btn_open_close.style.zIndex = '1';

        div.appendChild(div_content);

        document.body.appendChild(div);
        div.insertAdjacentElement('afterbegin',div_btn_open_close);

        
        div_btn_open_close.addEventListener('click',function(){
            this.stateTrigger['open_div'] = !this.stateTrigger['open_div'];
        }.bind(this));

        this.currentMenu = div;
        this.currentMenu_content = div_content;
      
    }


	
	menuDisplay_functionality(){
		 var export_html_btn = this.currentMenu.querySelector('#mainProperties_exportHtml_btn');
            export_html_btn.addEventListener('click',function(){
                this.exportHtml_function();
            }.bind(this))

        var save_html_btn = this.currentMenu.querySelector('#mainProperties_saveHTML_btn');
            save_html_btn.addEventListener('click',function(){
                this.saveHTML_function();
            }.bind(this))

        var load_html_btn = this.currentMenu.querySelector('#mainProperties_loadHTML_btn');
            load_html_btn.addEventListener('click',function(){
                this.loadHTML_function();
            }.bind(this))
        
        var delete_saved_html_btn = this.currentMenu.querySelector('#mainProperties_deleteSavedHTML_btn');
           delete_saved_html_btn.addEventListener('click',function(){
                var saved_html = localStorage.getItem('savedHTML');
                if(saved_html){
                    localStorage.removeItem('savedHTML');
                }
            }.bind(this))
            
	}

    exportHtml_function(){
        var originalScript = document.querySelector('.jsl_plugin_main_script');
        //remove all plugin class
        for(var i = 0; i < Object.keys(this.clsMouseStat.invalidClass).length;i++){
            var invalidClassElement = document.querySelectorAll('.'+Object.keys(this.clsMouseStat.invalidClass)[i]);
            invalidClassElement.forEach(function(val,index){
                val.remove();
            });
        }

        var modifiedHtml = document.documentElement.outerHTML;
        var newWindow = window.open('', '', 'width=800,height=600');
        newWindow.document.open();
        newWindow.document.write('<html><head><title>HTML Source Code</title></head><body>');
        newWindow.document.write('<pre>' + escapeHtml(modifiedHtml) + '</pre>');
        newWindow.document.write('</body></html>');
        newWindow.document.close();

        //readd js script
       
        this.exportHtml_reAddMainJs(originalScript.src);

        function escapeHtml(html) {
            return html.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');		 
        }

    }

    saveHTML_function(){
        var originalScript = document.querySelector('.jsl_plugin_main_script');
        //remove all plugin class
        for(var i = 0; i < Object.keys(this.clsMouseStat.invalidClass).length;i++){
            var invalidClassElement = document.querySelectorAll('.'+Object.keys(this.clsMouseStat.invalidClass)[i]);
            invalidClassElement.forEach(function(val,index){
                val.remove();
            });
        }

        var modifiedHtml = document.documentElement.outerHTML;
       localStorage.setItem('savedHTML',modifiedHtml);
       
       this.exportHtml_reAddMainJs(originalScript.src);
    }

    loadHTML_function(){
        var saved_html = localStorage.getItem('savedHTML');
        var originalScript = document.querySelector('.jsl_plugin_main_script');
        if(saved_html){
            document.open();
            document.write(saved_html);
            this.exportHtml_reAddMainJs(originalScript.src);
            document.close();
        }
    }


    exportHtml_reAddMainJs(src){
        var script = document.createElement('script');
    
        script.classList.add('jsl_plugin_main_script');
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
	
    resizeDisplay(){
       
        if(this.clsMouseStat.state.smallWindow == 0){
            this.currentMenu.style.width = "150px";
            this.currentMenu.style.height = "100%";
            this.currentMenu.style.right = "0px";
            this.currentMenu.style.top = "0px";
        }

        if(this.clsMouseStat.state.smallWindow == 1){
            this.currentMenu.style.width = "50%";
            this.currentMenu.style.height = "100%";
            this.currentMenu.style.right = "0px";
            this.currentMenu.style.top = "0px";
        }

        if(this.stateTrigger['open_div'] == true){
            this.currentMenu_content.style.display = 'block';
            this.currentMenu.style.zIndex = '3';
        } else {
            this.currentMenu.style.width = '0px';
            this.currentMenu_content.style.display = 'none';
            this.currentMenu.style.zIndex = '1'; //if hidden, lwoer the zindex
        }
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