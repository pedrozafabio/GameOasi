import Game from "./Game";

export default class ChatBot{
    prefix : string;

    commands : Record<string,(args : any, channel : string, message : Photon.Chat.Message)=>void>;
    constructor(prefix : string){
        this.prefix = prefix;
        this.commands = {
            'Ping' : (args : any, channel : string) =>{
                Game.GetInstance().gameChat.publishMessage(channel, `${this.prefix}Pong`);
            },
            'Pong' : (args : any, channel : string, message : Photon.Chat.Message) =>{
                //@ts-ignore
                window.ThreeChat.ReportOnline(channel, message.getSender());
            },
            'LeaveGroup' : (args : any, channel : string, message : Photon.Chat.Message) =>{
                if(channel.startsWith("Group@") && message.getSender() === Game.GetInstance().gameChat.getUserId()){
                    Game.GetInstance().gameChat.Unsubscribe([channel]);
                }
            },
            'KickFromGroup' : (args : any, channel : string, message : Photon.Chat.Message) =>{
                if(channel.startsWith("Group@") && args === Game.GetInstance().gameChat.getUserId()){
                    Game.GetInstance().gameChat.Unsubscribe([channel]);
                }
            },
        };
    }
    
    RunIfCommand(message : Photon.Chat.Message, channel : string) : boolean{
        let content : string = message.getContent();
        if(content.startsWith(this.prefix)){
            console.log("Command identified");
            let command = content.slice(this.prefix.length);
            let args = command.split(' ');
            command = args[0];
            console.log(command);
            args = args.slice(1);
            console.log(args);
            if(command in this.commands){
                this.commands[command](args.join(' '), channel, message);
                return true;
            }
        }
        return false;
    }
}