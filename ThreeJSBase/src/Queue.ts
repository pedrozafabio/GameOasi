export default class Queue<T> {
    items: T[];

    constructor() {
        this.items = [];
    }

    Push(element: T) : void {
        this.items.push(element);
    }

    Pop() : void {
        delete this.items[0];
        this.items = this.items.slice(1, this.items.length);
    }

    Top(): T{
        return this.items.length > 0 ? this.items[0] : null;
    }

    IsEmpty(): boolean {
        return this.items.length === 0;
    }

    Length() : number{
        return this.items.length;
    }

    Empty() : void{
        this.items = [];
    }
}