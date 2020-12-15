export default class Stack<T> {
    items: T[];

    constructor() {
        this.items = [];
    }

    Push(element: T) : void {
        this.items.push(element);
    }

    Pop() : void {
        this.items.pop();
    }

    Top(): T{
        return this.items.length > 0 ? this.items[this.items.length - 1] : null;
    }

    IsEmpty(): boolean {
        return this.items.length === 0;
    }
}