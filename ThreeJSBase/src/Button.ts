import HUD from './HUD.js'

export default class Button extends HUD{
    
    onClick : () => void;    
    url : string;
    label : string;

    constructor(container, width, height, position, visible, label, url, onClick?) {
        super(container, width, height, position, visible);
        
        this.url = url;
        this.onClick = onClick;
        this.label = label;

        this.Init("button");
    }

    Init(type : string) : void {
        super.Init(type);

        this.element.innerHTML = this.label;
        this.element.style.border = 'none';
        this.element.style.background = "rgba(0,0,0,0)"
        this.element.style.backgroundImage = 'url("'+this.url+ '")'
        this.element.style.backgroundRepeat = 'no-repeat';
        this.element.style.backgroundSize = '100% 100%';   
        
        this.element.style.color = "white";
        this.element.style.fontSize = "4vh";
       
        this.element.onclick = this.onClick;
    }

}