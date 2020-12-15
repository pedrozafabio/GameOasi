import * as THREE from "./../node_modules/three/src/Three.js";
import IGameObject from './IGameObject'
import { MathUtils } from "./../node_modules/three/src/Three.js";
import CharacterView from "./CharacterView.js";
import Input from "./Input.js";
import GameClient from './GameClient.js';

export enum ANIMATION_STATE {
    IDLE,
    WALKING,
    DANCING,
    DANCING_TOGETHER
};


export default class GameObject implements IGameObject{

    
    client : GameClient;

    mixer: THREE.AnimationMixer;
    object: THREE.Object3D;
    scene: THREE.Scene;
    name: string;
    
    path : THREE.Vector3[];

    needMove = false;
    movementVelocity = 10;
    timeToMove : number;
    movementTimer = 0;
    movementIndex = 0;
    
    needRotation = false;
    rotationVelocity = Math.PI/2;
    rotationTimer = 0;
    timeToRotate: number;
    
    posInit: THREE.Vector3;
    posFinal: THREE.Vector3;
    quaternionInit: THREE.Quaternion;
    quaternionFinal : THREE.Quaternion;

    charModel : CharacterView;

    actions : THREE.AnimationAction[] = [];
    actionsDance : THREE.AnimationAction[] = [];
    currentDance : THREE.AnimationAction;

    lastAction : THREE.AnimationAction;
    activeAction : THREE.AnimationAction;

    state = ANIMATION_STATE.IDLE;    

    dancingTimer = 0;
    duration;

    invitedToDance : { invitedBy : number, name : string} = null;
    blockInvites = false;
    cdInvite = 15;
    timerInvite =0;
    cantInvite = false;

    constructor(scene: THREE.Scene, name : string, outfit = null, position?, client?) {
        this.scene = scene;
        this.charModel = new CharacterView(outfit);
        this.name = name;
        this.client = client;
        this.InitializeObject(position);
    }

    SetMovimentation(path){
        this.movementTimer = 0;        
        this.movementIndex = 0; 
        this.path = path;        
        this.needMove = true;
        this.state = ANIMATION_STATE.WALKING;
        this.dancingTimer = 0;        
        this.setAction(ANIMATION_STATE.WALKING);
    }

    SetInvite(id: number, name: string){
        if(!this.invitedToDance){
            this.invitedToDance = { invitedBy : id, name : name};
            //@ts-ignore
            window.showDanceModal({onAccept : this.InviteAccepted.bind(this), name : name, onDecline: this.InviteDeclined.bind(this)});
        }
    }

    InviteAccepted(){
        this.client.raiseEvent(7, {to: this.invitedToDance.invitedBy, accepted : true});
        this.Dance(4);

        this.invitedToDance = null;
        this.timerInvite = 0;

        ///this.raiseevent7. passando o numero do cara que me enviou e o mesmo
        /// quem escutou executa a dança!!!

    }

    InviteDeclined(){
        if(this.client){
            this.client.raiseEvent(7, {to: this.invitedToDance.invitedBy, accepted : false});
            this.client.raiseEvent(8);
        }
        this.cantInvite = false;

        this.timerInvite = 0;

        this.invitedToDance = null;  
    }

    Update(dt: number): void {
        if(!this.object)
            return;

        this.mixer?.update(dt);
        this.RotationUpdate(dt); 
        this.MovementUpdate(dt);

    
        if(this.invitedToDance){
            this.timerInvite += dt;

            if(this.timerInvite >= this.cdInvite){
                    this.InviteDeclined();
                    //@ts-ignore
                    window.hideDanceModal();
            }

        }


        switch(this.state){
                default:   
                break;
            case ANIMATION_STATE.DANCING:
                if(this.dancingTimer == 0){
                    this.setAction(ANIMATION_STATE.DANCING);
                    this.duration = 6;
                    //cancel movimentations
                    this.needMove = false;
                    this.needRotation = false;
                }

                this.dancingTimer += dt;

                if(this.dancingTimer >= this.duration){
                    this.state = ANIMATION_STATE.IDLE;
                    this.setAction(this.state);
                    this.dancingTimer = 0;
                }

                break;

            case ANIMATION_STATE.DANCING_TOGETHER:
                if(this.dancingTimer == 0){
                    this.setAction(ANIMATION_STATE.DANCING);
                    this.duration = this.activeAction.getClip().duration;
                    //cancel movimentations
                    this.needMove = false;
                    this.needRotation = false;
                }

                this.dancingTimer += dt;

                if(this.dancingTimer >= this.duration){
                    this.state = ANIMATION_STATE.IDLE;
                    this.setAction(this.state);
                    this.dancingTimer = 0;
                    
                    if(this.client){
                        this.cantInvite = false;
                        this.client.raiseEvent(8);
                    }
                }
                
                break;
        }
    }

    Dance(i : number){
        let isDancingTogether = i >= this.actionsDance.length;
        let index = MathUtils.clamp(i, 0, this.actionsDance.length-1);
        this.state = isDancingTogether ? ANIMATION_STATE.DANCING_TOGETHER : ANIMATION_STATE.DANCING;   
        this.currentDance = this.actionsDance[index]; 

        this.dancingTimer = 0;

        if(this.client){
            this.client.raiseEvent(4, {danceIndex: i});
        }       
    }

    RotationUpdate(dt : number) {
        if (this.needRotation) {

            if(this.rotationTimer == 0){
               let posInit = this.path[this.movementIndex];
               let posFinal = this.path[this.movementIndex+1];

               if(!posInit || !posFinal){
                    this.needRotation = false;
               }else{
                const rotationMatrix = new THREE.Matrix4();
                rotationMatrix.lookAt(posFinal, posInit, this.object.up);

                this.quaternionInit = this.object.quaternion;
                this.quaternionFinal.setFromRotationMatrix(rotationMatrix);

                this.timeToRotate = this.quaternionInit.angleTo(this.quaternionFinal) / this.rotationVelocity;
               }               
                
            }

            this.rotationTimer += dt;
            let quaternion = this.quaternionInit.slerp(this.quaternionFinal, this.rotationTimer / this.timeToRotate);

            this.object.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

            if (this.rotationTimer >= this.timeToRotate) {
                this.rotationTimer = 0;
                this.needRotation = false;
            }
        }
    }

    MovementUpdate(dt : number) {
        if(this.needMove){

            if(this.movementTimer == 0 ){ 
                this.posInit = this.path[this.movementIndex];
                this.posFinal = this.path[this.movementIndex+1];

                if(this.posInit && this.posFinal){ 
                    this.rotationTimer = 0;
                    this.needRotation = true;
                    this.quaternionFinal = new THREE.Quaternion(); 
                    this.timeToMove = (this.posInit.distanceTo(this.posFinal) / this.movementVelocity);
                }else{
                    this.needMove = false;
                }
            }
            if(this.posInit && this.posFinal){ 
            this.movementTimer += dt;
            let t = this.movementTimer / this.timeToMove;
            
            let p1 = new THREE.Vector3(this.posInit.x, this.posInit.y, this.posInit.z);
            let p2 = new THREE.Vector3(this.posFinal.x, this.posFinal.y, this.posFinal.z);

            let pos = p1.lerp(p2, t);
            this.object.position.set(pos.x, pos.y, pos.z);

            if(t >= 1){
                this.movementIndex++;
                this.movementTimer = 0;
                
                if(this.movementIndex >= this.path.length-1){
                    this.needMove = false;
                    this.state = ANIMATION_STATE.IDLE;
                    this.setAction(ANIMATION_STATE.IDLE);
                }                
            } 
        }
        }
    }

    InitializeObject(pos?): void {
        
        this.object = this.charModel.object;   
        
        // this.object.castShadow = true;
        // this.object.receiveShadow = false;
        this.object.userData.name = this.name;
        this.object.userData.gameobject = this;
        
        if(pos)
            this.object.position.copy(pos);

        this.object.scale.set(3,3,3);        
        
        this.mixer = new THREE.AnimationMixer(this.object);

        this.actions[ANIMATION_STATE.IDLE] = this.mixer.clipAction(this.charModel.gltf.animations[2].optimize());
        this.actions[ANIMATION_STATE.WALKING] = this.mixer.clipAction(this.charModel.gltf.animations[5].optimize());
        this.actionsDance.push(this.mixer.clipAction(this.charModel.gltf.animations[0].optimize()));
        this.actionsDance.push(this.mixer.clipAction(this.charModel.gltf.animations[3].optimize()));
        this.actionsDance.push(this.mixer.clipAction(this.charModel.gltf.animations[1].optimize()));
        this.actionsDance.push(this.mixer.clipAction(this.charModel.gltf.animations[4].optimize()));
        
        this.setAction(ANIMATION_STATE.IDLE);

        this.scene.add(this.object);        
    }

    setAction = (state : ANIMATION_STATE) => {
        let toAction;

        if(state === ANIMATION_STATE.DANCING || state === ANIMATION_STATE.DANCING_TOGETHER)
            toAction = this.currentDance;
        else
            toAction = this.actions[state];

        if (toAction != this.activeAction) {
            this.lastAction = this.activeAction;
            this.activeAction = toAction;
            this.lastAction?.fadeOut(.2);
            this.activeAction?.reset().fadeIn(.2).play();
        }
    }



    Click() : void {
    }
}
