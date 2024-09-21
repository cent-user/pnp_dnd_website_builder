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
        editSection_legend.innerHTML = 'Edit Type'

            //edit option css
            var div_editType_css = document.createElement('div');
            var editType_css = document.createElement('label');
            editType_css.innerHTML = 'CSS';
            editType_css.setAttribute('for','editType_css');
            var editType_css_r = document.createElement('input');
            editType_css_r.id = 'editType_css'
            editType_css_r.type='radio'
            editType_css_r.value='editType_css'
            editType_css_r.name='mainProperties_option_1'

             //edit option css
             var div_editType_js = document.createElement('div');
             var editType_js = document.createElement('label');
             editType_js.innerHTML = 'JS';
             editType_js.setAttribute('for','editType_css');
             var editType_js_r = document.createElement('input');
             editType_js_r.id = 'editType_css'
             editType_js_r.type='radio'
             editType_js_r.value='editType_js'
             editType_js_r.name='mainProperties_option_1'


        div.appendChild(editSection);
        editSection.appendChild(editSection_legend);
        editSection.appendChild(div_editType_css);
            div_editType_css.appendChild(editType_css_r);
            div_editType_css.appendChild(editType_css);
        editSection.appendChild(div_editType_js);
            div_editType_js.appendChild(editType_js_r);
            div_editType_js.appendChild(editType_js);

       
       

        this.currentMenu = div;
        document.body.appendChild(div);
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