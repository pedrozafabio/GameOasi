import '../src/photon/Photon-Javascript_SDK.js'
import ChatObject from './ChatObject.js';
import Game from './Game.js';


export default class GameChat extends Photon.Chat.ChatClient{
    logger : Exitgames.Common.Logger;
    chatObject : ChatObject;
    userInfo : any;

    onSubscribeResultCallback : (results : any) => void; 
    onConnectedToFrontEnd : () => void;
    onReceivedMessage : (channelName : string, messages : Photon.Chat.Message[]) =>void;

    constructor(){
        //@ts-ignore
        super(Photon.ConnectionProtocol.Wss, `${NODE_ENV['PHOTON-CHAT-TOKEN']}`, `${NODE_ENV['VERSION']}`);
        this.logger  = new Exitgames.Common.Logger("Chat: ");
        this.setLogLevel(Exitgames.Common.Logger.Level.INFO);

        this.chatObject = new ChatObject(this);

        this.onReceivedMessage = (channelName:string, messages : Photon.Chat.Message[])=>{
            messages.map(message =>{
                this.chatObject.AddMessage(channelName, message);
            });
        }

        //@ts-ignore
        window.ThreeChat = window.ThreeChat ?? {};
        //@ts-ignore
        window.ThreeChat.SendPrivateMessage = this.sendPrivateMessage.bind(this);
        //@ts-ignore
        window.ThreeChat.ChatClient = this;
    }

    onStateChange(state : number) {
        this.logger.info("State: ", Photon.Chat.ChatClient.StateToName(state));
        if(state === Photon.Chat.ChatClient.State.ConnectedToMaster){
            if(this.onConnectedToFrontEnd){
                this.onConnectedToFrontEnd();
                this.Subscribe(["Main"]);
            }
        }
    }

    Connect() : void {
        this.connectToRegionFrontEnd("us")
    }

    Subscribe(channels : string[]) : void{
        this.logger.info("Subscribing to channels");
        console.log(channels);
        this.subscribe(channels);
    }

    Unsubscribe(channels : string []) : void{
        this.logger.info("Unsubscribing to channels");
        this.unsubscribe(channels);
    }

    onSubscribeResult(results : Object) : void{
        let success = Object.keys(results).filter((x)=>results[x]);
        this.chatObject.SubscribedToChannels(success);
        if(this.onSubscribeResultCallback){
            this.onSubscribeResultCallback(results);
        }
        console.log("Chat subscibe results");
        console.log(results);
    }

    onUnsubscribeResult(results : Object) : void {
        console.log("Chat unsubscribe results");
        console.log(results);
        let success = Object.keys(results).filter((x)=>results[x]);
        this.chatObject.UsubscribeToChannels(success);
    }

    ConnectToFriends(){
        
    }

    onChatMessages(channelName : string, messages : Photon.Chat.Message[]) {
        console.log(`Received message in channel ${channelName}`);
        if(this.onReceivedMessage){
            this.onReceivedMessage(channelName, messages);
        }
    }

    onPrivateMessage(channel : string, message : Photon.Chat.Message){
        console.log(`Received message from ${channel}`);
        this.chatObject.onReceivePrivateMessage(channel,message);
    }
}

class ChatScope {
    channelName : string;
    type : string
}