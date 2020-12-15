import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api-game.oasi.vc/',
    headers: {
        Authorization : `Bearer ${localStorage.getItem('token')}`
    }
});

export default instance;

// /character/ida