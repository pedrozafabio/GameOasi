import { request } from "https";
import { getGeneratedNameForNode } from "typescript";
import ChatObject from "./ChatObject";
import Game from "./Game.js";
import TransitionScene from "./TransitionScene";
import instance from './axios-ClientAPI'


export default class PrivateChatBot {
    prefix : string;

    commands : Record<string,(args : any, message : Photon.Chat.Message)=>void>;
    constructor(prefix : string){
        this.prefix = prefix;
        this.commands = {
            'JoinGroup' : (args : any, message : Photon.Chat.Message) => {
                Game.GetInstance().gameChat.Subscribe(args);
            },
            'LeaveGroup' : (args : any, message : Photon.Chat.Message) =>{
                args = args.split(' ');
                if(args.length > 1){
                    if(args[1] === Game.GetInstance().gameChat.getUserId()){
                        Game.GetInstance().gameChat.Unsubscribe(args);
                    }
                }
            },
            'Invite' : (args : any, message : Photon.Chat.Message) =>{
                console.log(args);
                if(message.getSender() === Game.GetInstance().gameChat.getUserId()){
                    console.log("Not invited it's you!!");
                }else{
                    console.log(JSON.parse(args[0]));
                    //@ts-ignore
                    window.THREEInvitation.AddInvitation({
                        onAccept : ()=>{Game.GetInstance().ChangeScene(new TransitionScene(Game.GetInstance().container, Game.GetInstance().renderer, JSON.parse(args[0]), {users:[]}));},
                        message : `${message.getSender()} has invited you to his party!`
                    });
                }
            },
            'AddFriend' : (args : any, message : Photon.Chat.Message) =>{
                console.log(message.getSender());
                if(message.getSender() === Game.GetInstance().gameChat.getUserId()){
                    return;
                }


                //@ts-ignore
                window.THREEInvitation.AddInvitation({
                    
                    onAccept : ()=>{
                        Game.GetInstance().gameChat.sendPrivateMessage(message.getSender(), "/*/Accept");
                        instance.post(`/api/v1/characters/add-friend/${message.getSender()}`)
                            .then(response=>{console.log(response)})
                            .catch(error => {console.log(error);})                        
                    },
                    message : `${message.getSender()} quer te adicionar como amigue!`
                });
            },
            'Accept' : (args : any, message : Photon.Chat.Message) =>{
                console.log(message.getSender());

                if(message.getSender() === Game.GetInstance().gameChat.getUserId()){
                    return;
                }

                instance.post(`/api/v1/characters/add-friend/${message.getSender()}`);                        
            }
        };
    }
    
    RunIfCommand(message : Photon.Chat.Message) : boolean{
        let content : string = message.getContent();
        if(content.startsWith(this.prefix)){
            console.log("Command identified");
            let command = content.slice(this.prefix.length);
            let args = command.split(' ');
            command = args[0];
            console.log(command);
            console.log(this.commands);
            args = args.slice(1);
            console.log(args);
            if(command in this.commands){
                this.commands[command](args, message);
                return true;
            }
        }
        return false;
    }
}