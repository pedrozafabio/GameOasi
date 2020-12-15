import HUD from './HUD.js'

export default class Image extends HUD{
    url : string;
    canvas : HTMLElement;
    
    constructor(container, width, height, position, visible, url) {
        super(container, width, height, position, visible);
        this.width = width;
        this.height = height;
        this.position = position;
        this.container = container;
        this.url = url;
        this.Init("img");
    }

    Init(type : string) : void {
        super.Init(type);
        
        this.element.style.border = 'none';
        this.element.style.background = "rgba(0,0,0,0)";
        (<HTMLImageElement>this.element).src = this.url;
        this.element.style.backgroundRepeat = 'no-repeat';
        this.element.style.backgroundSize = '100% 100%'; 
        
        
    }    

}