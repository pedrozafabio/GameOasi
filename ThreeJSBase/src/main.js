import Game from '../build/Game';

console.log(process.env);

let game = Game.GetInstance();

//browserify main.js -p esmify -o bundle.js