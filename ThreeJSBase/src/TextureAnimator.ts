import * as THREE from "../node_modules/three/src/Three.js";

export default class TextureAnimator {

    texture : THREE.Texture;
    columns : number;
    rows : number;
    animationDuration : number;
    
    private numberOfTiles : number;
    private currentTile : number;
    private time : number;
    private frameDuration : number;

    constructor(texture, columns, rows, animationDuration, numberoftiles?) {
        this.texture = texture;
        this.columns = columns;
        this.rows = rows;
        this.numberOfTiles = numberoftiles?? columns * rows;
        this.animationDuration = animationDuration;

        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping; 
        this.texture.repeat.set(1 / this.columns, 1 / this.rows);

        this.time = 0;
        this.currentTile = 0;

        this.frameDuration = this.animationDuration/this.numberOfTiles;
    }

    Update(dt){
        this.time += dt;
        // console.log(this.time);

		if(this.time > this.frameDuration)
		{
            this.currentTile++;

            if (this.currentTile === this.numberOfTiles)
                this.currentTile = 0;

            var currentColumn = this.currentTile % this.columns;
            var currentRow = Math.floor(this.currentTile / this.columns);

            this.texture.offset.x = currentColumn / this.columns;
            this.texture.offset.y = currentRow / this.rows;

            this.time = 0;            
		}
    }


}
