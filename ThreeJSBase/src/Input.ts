import { memory } from "console";
import * as THREE from "./../node_modules/three/src/Three.js";
import Game from "./Game.js";

export default class Input {
  static instance: Input;

  onButtonDown: any;
  onButtonUp: any;

  buttonState: any;

  mouseButtonDown: any;
  mouseButtonUp: any;
  mouseButtonState: any;

  wheel: any;

  mouse: THREE.Vector2;

  static MouseButtons = {
    left: 0,
    middle: 1,
    right: 2,
  };

  private constructor() {
    this.onButtonDown = {};
    this.onButtonUp = {};
    this.buttonState = {};
    this.mouseButtonDown = {};
    this.mouseButtonUp = {};
    this.mouseButtonState = {};

    this.mouse = new THREE.Vector2();

    let w = Game.GetInstance().container;

    w.addEventListener("keydown", (event) => {
      this.onButtonDown[event.key] = true;
      this.onButtonUp[event.key] = false;
    });
    w.addEventListener("keyup", (event) => {
      this.onButtonUp[event.key] = true;
      this.onButtonDown[event.key] = false;
    });

    w.addEventListener("wheel", (event) => {
      this.wheel = event;
    });

    window.addEventListener(
      "mousemove",
      (event) => {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      },
      false
    );

    w.addEventListener("mousedown", (event) => {
      this.mouseButtonDown[event.button] = true;
      this.mouseButtonUp[event.button] = false;
    });

    w.addEventListener("mouseup", (event) => {
      this.mouseButtonDown[event.button] = false;
      this.mouseButtonUp[event.button] = true;
    });

    Input.instance = this;
  }

  static GetInstance(): Input {
    if (Input.instance) return Input.instance;
    new Input();
    return Input.instance;
  }

  Update() {
    this.wheel = null;
    for (const key of Object.keys(this.onButtonDown)) {
      this.buttonState[key] = this.onButtonDown[key];
    }
    for (const key of Object.keys(this.mouseButtonDown)) {
      this.mouseButtonState[key] = this.mouseButtonDown[key];
    }
  }

  IsKeyPressed(key: string): boolean {
    return !this.buttonState[key] && this.onButtonDown[key];
  }

  IsKeyDown(key: string): boolean {
    return this.buttonState[key];
  }

  IsKeyUp(key: string): boolean {
    return this.buttonState[key] && this.onButtonUp[key];
  }

  IsMouseKeyPressed(key: number) {
    return !this.mouseButtonState[key] && this.mouseButtonDown[key];
  }

  IsMouseButtonDown(key: number) {
    return this.mouseButtonState[key];
  }

  IsMouseButtonUp(key: number) {
    return this.mouseButtonState[key] && this.mouseButtonUp[key];
  }

  SetMouseToMiddle() {
    this.mouse.x = 0;
    this.mouse.y = 0;
  }
}
