import HUD from './HUD.js'

export default class Panel extends HUD{
    width : number;
    height : number;
    position : [number, number];
    container : HTMLElement;
    url : string;

    transparentPanel : HTMLElement;

    isModal : boolean;

    pointerEvents : boolean;
    src : string;

    constructor(container, width, height, position, visible, isModal, pointerEvents, src) {
        super(container, width, height, position, visible);
        this.width = width;
        this.height = height;
        this.position = position;
        this.container = container;
        this.isModal = isModal;
        this.pointerEvents = pointerEvents;
        this.src = src;
        this.Init('embed');
    }

    Init(type : string) : void {
        super.Init(type);     

        // if (this.isModal) {
        //     let posX = (0.5 * 100);
        //     let posY = (0.5 * 100);   

        //     this.transparentPanel = document.createElement('div');
        //     this.transparentPanel.style.position = 'absolute';
        //     this.transparentPanel.style.height = '100%';
        //     this.transparentPanel.style.width = '100%';
        //     this.transparentPanel.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';

        //     this.transparentPanel.style.zIndex = '100';
        //     this.transparentPanel.style.position = "absolute";
        //     this.transparentPanel.style.left = "0%";
        //     this.transparentPanel.style.top = "0%";

        //     this.transparentPanel.onclick = () => {
        //         this.SetVisible(!this.visible);
        //     }
        // }

        
        (<HTMLEmbedElement> this.element).src = this.src;
        this.element.style.borderRadius = '20px';
        this.element.style.backgroundColor = "rgba(255, 255, 255, 1)"
        this.element.style.backgroundSize = '100% 100%';   
        this.element.style.zIndex = '101';
        
        this.element.style.pointerEvents = this.pointerEvents ? 'auto' : 'none'; 
               
    }    

}