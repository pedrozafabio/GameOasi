
export default class HUD{
    width : number;
    height : number;
    position : [number, number];
    container : HTMLElement;
    element : HTMLElement;
    visible : boolean;

    constructor(container, width, height, position, visible){
        this.width = width;
        this.height = height;
        this.position = position;
        this.container = container;
        this.visible = visible;
    }

    Init(type : string) : void {
        this.element = document.createElement(type);

        this.element.style.position = "absolute";
        this.element.style.left = this.position[0] - this.width/2 + "%";
        this.element.style.top = this.position[1] - this.height/2 + "%";
        this.element.style.width = this.width + "%";
        this.element.style.height = this.height + "%";

        this.Attach();
        this.SetVisible(this.visible);
    }

    SetVisible(visible : boolean) : void {
        this.visible = visible;
        this.element.style.visibility = visible ? 'visible' : 'hidden';
    }

    Attach() : void {
        this.container.appendChild(this.element);
    }

    Dettach() : void {
        this.container.removeChild(this.element);
    }

    Destroy() {
        this.element.remove();
    }
}