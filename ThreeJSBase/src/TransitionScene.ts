import { LogLuvEncoding, WebGLRenderer } from "three";
import { getGeneratedNameForNode } from "typescript";
import ArtGalleryScene from "./ArtGalleryScene";
import BuildAvatarScene from "./BuildAvatarScene";
import FeiraScene from "./FeiraScene";
import Game from "./Game";
import IScene from "./IScene";
import MapScene from "./MapScene";
import Scene from "./Scene";
import ShowScene from "./ShowScene";
import * as THREE from "../node_modules/three/src/Three.js";


export default class TransitionScene extends IScene {
    roomConfigurations : any;
    offline : boolean;
    constructor(container: HTMLElement, renderer: WebGLRenderer, roomConfigurations : {"Type" : string, "Map" : string, Tag : string}, invite : {users : string[]}, online = true) {
        super(container, renderer);
        let gameClient = Game.GetInstance().gameClient;
        let gameChat = Game.GetInstance().gameChat;

        this.scene= new THREE.Scene();
    this.scene.background = new THREE.Color("#000000");

        if(gameClient.isJoinedToRoom()){
            console.log("Unsubscribing from chat");
            gameChat.Unsubscribe([`Sala@${gameClient.myRoom().name}`]);
        }
        this.roomConfigurations = roomConfigurations;

        gameClient.leaveRoom();
        this.offline = !online;

        if(online){
            this.ConnectToRoom(this.roomConfigurations);
            gameClient.onJoinRoomCallback = (createByMe)=>{
                if(gameChat.isConnectedToFrontEnd()){
                    console.log(`${gameClient.myRoom().name}`);
                    //this.messages[`${this.client.myRoom().name}`] = new Queue<HTMLElement>();
                    gameChat.Subscribe([`Sala@${gameClient.myRoom().name}`]);
                }
                this.ChangeScene(this.roomConfigurations, invite);
            }
        }else{
            console.log("Offline change scene");
            console.log(this.roomConfigurations);
            
            this.ChangeScene(this.roomConfigurations, invite);
        }
        //@ts-ignore
        window.SetOnLoading(true);
    }

    ChangeScene(roomConfigurations : any, invite : {users : string[]}){
        let gameClient = Game.GetInstance().gameClient;
        let gameChat = Game.GetInstance().gameChat;

        //@ts-ignore
        window.THREEGame = window.THREEGame ?? {};
        //@ts-ignore
        window.THREEGame.gameClient = gameClient;
        //@ts-ignore
        window.SetOnLoading(false);




        

        switch(roomConfigurations["Type"]){
            case "Show":{
                if(invite.users.length > 0){
                    invite.users.map(user =>{
                        gameChat.sendPrivateMessage(user, `/*/Invite ${JSON.stringify(roomConfigurations)}`);
                    })
                    Game.GetInstance().ChangeScene(new ShowScene(this.container, this.renderer, {show : this.roomConfigurations.Map}));
                }
                //@ts-ignore
                window.setButtonBackVisible(true);
                //@ts-ignore
                window.ThreeChat.setVisible(true);
                // //@ts-ignore
                // window.setButtonVoteVisible(false);
                //@ts-ignore
                window.setHotkeysVisible(true);
                break;
            }
            case "Map" : {
                Game.GetInstance().ChangeScene(new MapScene(this.container, this.renderer));
                //@ts-ignore
                window.setButtonBackVisible(false);
                //@ts-ignore
                window.ThreeChat.setVisible(true);
                // //@ts-ignore
                // window.setButtonVoteVisible(false);
                //@ts-ignore
                window.setHotkeysVisible(false);
                break;
            }
            case "Galeria" : {
                Game.GetInstance().ChangeScene(new ArtGalleryScene({gallery : this.roomConfigurations.Map}));
                //@ts-ignore
                window.setButtonBackVisible(true);
                // //@ts-ignore
                // window.setButtonVoteVisible(true);
                //@ts-ignore
                window.ThreeChat.setVisible(true);
                //@ts-ignore
                window.setHotkeysVisible(false);
                break;
            }
            case "Feira":{
                console.log("Changing to feira");
                Game.GetInstance().ChangeScene(new FeiraScene());
                //@ts-ignore
                window.setButtonBackVisible(true);
                // //@ts-ignore
                // window.setButtonVoteVisible(false);
                //@ts-ignore
                window.ThreeChat.setVisible(true);
                //@ts-ignore
                window.setHotkeysVisible(false);
                break;
            }

            case "EditAvatar": {
                Game.GetInstance().ChangeScene(new BuildAvatarScene(this.container, this.renderer));
                //@ts-ignore
                window.setButtonBackVisible(false);
                //@ts-ignore
                window.setButtonVoteVisible(false);
                //@ts-ignore
                window.ThreeChat.setVisible(false);
                //@ts-ignore
                window.setHotkeysVisible(false);
            }
        }
    }

    Update(dt: number): void {
        if(this.offline){
            this.ChangeScene(this.roomConfigurations, {users:[]});
        }
        console.log("Stuck here!");
    }
}