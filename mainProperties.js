export default class clsMainProperties{
    constructor(clsMouseStat){
        //dom tree element
		this.currentMenu = null; 

        this.editType_checked = null;
        this.clsMouseStat = clsMouseStat;
        this.menuDisplay();
    }

    process(){
        var editType_checked =  document.querySelector('input[name=mainProperties_option_1]:checked');
        this.editType_checked = editType_checked?.value;

        this. resizeDisplay();
     }

    menuDisplay(){
        var div = document.createElement('div');
        div.classList.add('clsMainProperties');
        div.style.backgroundColor = '#aaddddaa';
        div.style.position = "fixed";

        //edit option
        var editSection = document.createElement('fieldset');
        var editSection_legend = document.createElement('legend');
        editSection_legend.innerHTML = 'Edit Type';
        div.appendChild(editSection);
        editSection.appendChild(editSection_legend);
            var objEditType = [
               {
                    'name':'mainProperties_option_1'
                    ,'text':'None'
                    ,'value':'editType_none'
                    ,'id':'editType_none'
                    ,'checked':false
                },
                {
                    'name':'mainProperties_option_1'
                    ,'text':'CSS'
                    ,'value':'editType_css'
                    ,'id':'editType_css'
                    ,'checked':true
                },
                {
                    'name':'mainProperties_option_1'
                    ,'text':'JS'
                    ,'value':'editType_js'
                    ,'id':'editType_js'
                    ,'checked':false
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

                editSection.appendChild(elDiv);
                elDiv.appendChild(elInput);
                elDiv.appendChild(elLabel);
			})

  


        // drag option
          var dragSection = document.createElement('fieldset');
          var dragSection_legend = document.createElement('legend');
          dragSection_legend.innerHTML = 'Drag Type';
          div.appendChild(dragSection);
          dragSection.appendChild(dragSection_legend);
              var objDragType = [
                 {
                      'name':'mainProperties_option_1'
                      ,'text':'Fixed'
                      ,'value':'dragType_fixed'
                      ,'id':'dragType_fixed'
                      ,'checked':false
                  },
                  {
                      'name':'mainProperties_option_1'
                      ,'text':'Layout'
                      ,'value':'dragType_layout'
                      ,'id':'dragType_layout'
                      ,'checked':false
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
  
                  dragSection.appendChild(elDiv);
                  elDiv.appendChild(elInput);
                  elDiv.appendChild(elLabel);
              })
  
       
        
        document.body.appendChild(div);

        this.currentMenu = div;
      
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
    }
}