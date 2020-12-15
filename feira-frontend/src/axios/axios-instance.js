import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api-game.oasi.vc',
});

export default instance;