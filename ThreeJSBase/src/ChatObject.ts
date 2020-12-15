import ChatBot from "./ChatBot.js";
import Game from "./Game.js";
import GameChat from "./GameChat.js";
import PrivateChatBot from "./PrivateChatBot.js";
import Queue from "./Queue.js";
import * as Stand from './Classes/Feira/Stand'

export default class ChatObject{
    mainElement : HTMLElement;
    chatTabs : Record<string, HTMLElement>;

    privateChatTabs : Record<string, HTMLElement>;

    chatContainer: HTMLElement;
    chatContainers : Record<string, HTMLElement>;
    privateChatContainers : Record<string, HTMLElement>;

    chatInput : HTMLInputElement;
    chatText : Record<string, Queue<HTMLElement>>;
    privateChatText : Record<string, Queue<HTMLElement>>;
    chatTabsContainer : HTMLElement;
    currentChannel : string;

    addChannel : HTMLElement;
    onAddChannel : boolean;

    sendMessage : any;

    gameChat : GameChat;
    onPrivateChannel : boolean;

    privateBot : PrivateChatBot;
    publicBot : ChatBot;
    
    constructor(chat : GameChat){
        this.gameChat = chat;

        this.privateBot = new PrivateChatBot('/*/');
        this.publicBot = new ChatBot('/*/');

        
    }

    UsubscribeToChannels(channels : string[]){
      console.log(channels);
      
      console.log(this.chatTabs);
        channels.map((channel)=>{
          //@ts-ignore
          window.ThreeChat?.RemoveTab({name : channel});

        });
    }

    SubscribedToChannels(channels : string[]){        
      channels.map((channel)=>{
        //React connection
        //@ts-ignore
        window.ThreeChat?.CreateTab({name : channel, 
          sendMessage : (message)=>{
            console.log(message);
            
            Game.GetInstance().gameChat.publishMessage(channel, message.trim());
          },
        });

        if(channel.startsWith("Group@")){
          this.gameChat.publishMessage(channel, `${this.publicBot.prefix}Ping`);
        }
      });
    }

    AddMessage(channel : string, message : Photon.Chat.Message) : void {
      if(this.publicBot.RunIfCommand(message, channel)){
        return;
      }
      
      //@ts-ignore
      window.ThreeChat.PublicTab[channel].AddMessage(`${message.getSender()}: ${message.getContent()}`);

      if(channel.startsWith("Group@")){
        if(message.getSender() != this.gameChat.getUserId()){
          //@ts-ignore
          window.showToast("Nova mensagem de grupo: " + channel.split("Group@")[1].split("#")[0] + "!", "info");
        }
      }
    }

    AddPrivateMessage(channel : string, message : Photon.Chat.Message) : void {
      if(this.privateBot.RunIfCommand(message)){
        return;
      }

      //@ts-ignore
      if(!window.ThreeChat.PrivateTab[channel]){
        this.CreatePrivateChannel(channel);
      }

      let content = message.getContent() as string;
      if(content.length > 0){
        //@ts-ignore
        window.ThreeChat.PrivateTab[channel].AddMessage(`${message.getSender()}: ${message.getContent()}`);
      }

      if(message.getSender() != this.gameChat.getUserId()){
        //@ts-ignore
        window.showToast("Mensagem de " + message.getSender() + "!", "info");
      }
  }

    CreatePrivateChannel(channel : string){
      //@ts-ignore
      window.ThreeChat?.CreatePrivateTab({name : channel, sendMessage : (message)=>{
        Game.GetInstance().gameChat.sendPrivateMessage(channel, message.trim());
      } });
  }

  onReceivePrivateMessage(channel : string, message : Photon.Chat.Message) : void{
    this.AddPrivateMessage(channel, message);
  }

  dispose(){
      document.body.removeChild(this.mainElement);
  }
}