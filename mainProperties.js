export default class clsMainProperties{
    constructor(clsMouseStat){
        //dom tree element
		this.currentMenu = null; 

        this.editType_checked = null;
        this.clsMouseStat = clsMouseStat;
        this.stateTrigger = []
        this.stateTrigger['open_div'] = true;
        this.menuDisplay();
    }

    process(){
        var editType_checked =  document.querySelector('input[name=mainProperties_option_1]:checked');
        this.editType_checked = editType_checked?.value;

        this. resizeDisplay();
     }

    menuDisplay(){
        var div = document.createElement('div');
        var div_content = document.createElement('div');
        div_content.classList.add('clsMainProperties_divContent');

        div.classList.add('clsMainProperties');
        div.style.backgroundColor = '#aaddddaa';
        div.style.position = "fixed";

        //edit option
        var editSection = document.createElement('fieldset');
        var editSection_legend = document.createElement('legend');
        editSection_legend.innerHTML = 'Edit Type';
       
        editSection.appendChild(editSection_legend);
            var objEditType = [
               {
                    'name':'mainProperties_option_1'
                    ,'text':'None'
                    ,'value':'editType_none'
                    ,'id':'editType_none'
                    ,'checked':false
                    ,'disabled':false
                },
                {
                    'name':'mainProperties_option_1'
                    ,'text':'CSS'
                    ,'value':'editType_css'
                    ,'id':'editType_css'
                    ,'checked':true
                    ,'disabled':false
                },
                {
                    'name':'mainProperties_option_1'
                    ,'text':'JS'
                    ,'value':'editType_js'
                    ,'id':'editType_js'
                    ,'checked':false
                    ,'disabled':true
                }
             ];

            objEditType.forEach(element => {
				var elDiv = document.createElement('div');
                var elLabel =  document.createElement('label');
                elLabel.innerHTML = element.text;
                elLabel.setAttribute('for',element.id);
                var elInput = document.createElement('input');
                elInput.type='radio';
                elInput.id = element.id;
                elInput.value = element.value;
                elInput.name= element.name;
                elInput.checked = element.checked;
                elInput.disabled = element.disabled;

                editSection.appendChild(elDiv);
                elDiv.appendChild(elInput);
                elDiv.appendChild(elLabel);
			})

  


        // drag option
          var dragSection = document.createElement('fieldset');
          var dragSection_legend = document.createElement('legend');
          dragSection_legend.innerHTML = 'Drag Type';
        
          dragSection.appendChild(dragSection_legend);
              var objDragType = [
                 {
                      'name':'mainProperties_option_1'
                      ,'text':'Fixed'
                      ,'value':'dragType_fixed'
                      ,'id':'dragType_fixed'
                      ,'checked':false
                      ,'disabled':true
                  },
                  {
                      'name':'mainProperties_option_1'
                      ,'text':'Layout'
                      ,'value':'dragType_layout'
                      ,'id':'dragType_layout'
                      ,'checked':false
                      ,'disabled':false
                  }
               ];
  
               objDragType.forEach(element => {
                  var elDiv = document.createElement('div');
                  var elLabel =  document.createElement('label');
                  elLabel.innerHTML = element.text;
                  elLabel.setAttribute('for',element.id);
                  var elInput = document.createElement('input');
                  elInput.type='radio';
                  elInput.id = element.id;
                  elInput.value = element.value;
                  elInput.name= element.name;
                  elInput.checked = element.checked;
                  elInput.disabled = element.disabled;

                  dragSection.appendChild(elDiv);
                  elDiv.appendChild(elInput);
                  elDiv.appendChild(elLabel);
              })
  
       
        //open / close menu
        var div_btn_open_close = document.createElement('button');
        div_btn_open_close.style.width = '20px';
        div_btn_open_close.style.height = '20px';
        div_btn_open_close.style.backgroundColor = 'purple';
        div_btn_open_close.style.position = 'relative';
        div_btn_open_close.style.left = '-20px';
        div_btn_open_close.style.top = '0px';
       
        div_content.appendChild(editSection);
        div_content.appendChild(dragSection);
        div.appendChild(div_content);
        document.body.appendChild(div);
        div.insertAdjacentElement('afterbegin',div_btn_open_close);


        div_btn_open_close.addEventListener('click',function(){
            this.stateTrigger['open_div'] = !this.stateTrigger['open_div'];
        }.bind(this));

        this.currentMenu = div;
        this.currentMenu_content = div_content;
      
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
        } else {
            this.currentMenu.style.width = '0px';
            this.currentMenu_content.style.display = 'none';
        }
    }
}