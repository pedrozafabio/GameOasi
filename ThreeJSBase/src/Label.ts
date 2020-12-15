import HUD from './HUD.js'

export default class Label extends HUD{
       
    label : string;
    fontSize : string;
    color : string;
    fontFamily : string;

    constructor(container, position, visible, label, fontSize, color?, fontFamily?) {
        super(container, 0, 0, position, visible);
        this.fontSize = fontSize;
        this.color = color;
        this.label = label;
        this.fontFamily = fontFamily;
        this.Init('div');
    }

    Init(type : string) : void {        
        this.element = document.createElement(type);

        this.element.innerHTML = this.label;        
        
        
        this.element.style.fontSize = this.fontSize;

        this.element.style.fontFamily = this.fontFamily;
        this.element.style.color = this.color ? this.color : '#000000';
        this.element.style.position = "absolute";
        this.element.style.left = this.position[0] +"%";
        this.element.style.top = this.position[1] +"%";  

        this.Attach();

        this.SetVisible(this.visible);
    }

    UpdateText(label : string){
        this.label = label;
        this.element.innerHTML = this.label;  
    }

}