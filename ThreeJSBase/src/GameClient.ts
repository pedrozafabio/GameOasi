import  "../src/photon/Photon-Javascript_SDK.js";
import { debug } from "console";

export default class MyClient extends Photon.LoadBalancing.LoadBalancingClient{
    logger : Exitgames.Common.Logger;
    onActorJoinCallback : (params : Photon.LoadBalancing.Actor) => void;
    onActorLeaveCallback : (params : Photon.LoadBalancing.Actor) => void;
    onEventCallback : (code: number, content: any, actorNumber : number) =>void;
    onJoinRoomCallback : (createdByMe : boolean) => void;
    onJoinLobbyCallback : () => void;
    onConnectedToMaster : ()=>void;

    readonly maxRoomSize = 125;

    constructor(){
        //@ts-ignore
        super(Photon.ConnectionProtocol.Wss ,`${NODE_ENV['PHOTON-CLIENT-TOKEN']}`, `${NODE_ENV['VERSION']}`);
        this.logger  = new Exitgames.Common.Logger("GameClient: ");
    }

    Connect() : void {
        if(this.connectToRegionMaster('sa')){
            this.logger.info("Joinded South America servers");
        }
    }

    ConnectToRoom(roomProperties : any){
        if(this.isInLobby){
            if(this.joinRandomRoom({expectedCustomRoomProperties: roomProperties})){
                this.logger.info("Trying to create a room");
                this.createRoom(null, {
                    customGameProperties: roomProperties,
                    maxPlayers: this.maxRoomSize,
                    isOpen : true,
                    isVisible : true
                });
            }
        }
    }

    JoinFriend(mapConfigurations : any){
        this.joinRandomRoom({
            expectedCustomRoomProperties : mapConfigurations
        });
    }

    onStateChange(state : number){
        this.logger.info(`${state}`);
        if(state === Photon.LoadBalancing.LoadBalancingClient.State.JoinedLobby){
            if(this.onJoinLobbyCallback){
                this.onJoinLobbyCallback();
            }
            // if(this.isInLobby()){
            //     if(this.joinRandomRoom(this.roomProperties)){
            //         this.logger.info("Trying to create a room");
            //         this.createRoom(null, {
            //             customGameProperties: this.roomProperties,
            //             maxPlayers: this.maxRoomSize,
            //             isOpen : true,
            //             isVisible : true
            //         });
            //     }
            // }            
        }

        if(state === Photon.LoadBalancing.LoadBalancingClient.State.ConnectedToMaster){
            if(this.onConnectedToMaster){
                this.onConnectedToMaster();
            }
        }

        if(state === Photon.LoadBalancing.LoadBalancingClient.State.Joined){
            if(this.isJoinedToRoom()){
                this.logger.info("joined a room");
                console.log(this.myRoom());
                
            }
        }
    }

    onEvent(code: number, content: any, actorNr: number): void{
        if(this.onEventCallback){
            this.onEventCallback(code, content, actorNr);
        }
    }

    onJoinRoom(createdByMe : boolean){
        this.logger.info("Joinned room " + this.myRoom().name);
        console.log(this.myRoom());

        console.log(this.onJoinRoomCallback);
        
        if(this.onJoinRoomCallback){
            console.log("Calling callback");
            this.onJoinRoomCallback(createdByMe);
        }
    }

    onActorJoin(actor : Photon.LoadBalancing.Actor){
        this.logger.info("Actor joined");
        if(this.onActorJoinCallback){
            this.onActorJoinCallback(actor);
        }
    }

    onActorLeave(actor : Photon.LoadBalancing.Actor, cleanup : boolean){
        if(this.onActorLeaveCallback){
            this.onActorLeaveCallback(actor);
        }
        this.logger.info("Actor left");
    }

    onRoomList(roomInfo : Photon.LoadBalancing.RoomInfo[]) : void{
        console.log(roomInfo);
    }
}