import Vue from 'vue';
import axios from 'axios';
import hmy from './hmy.js';

window.hmy = hmy;
const EMOJI_ABI = require('./emoji.sol.json');
const EMOJI_ADDRESS = 'one1kml3y2emq6fmh6ea7vta5r33rwd09rku2z5mpl';

const BASE_URL = '/emoji';
const EMOJI_URL = `${BASE_URL}/color/`;
function fetchEmoji(url) {
  return axios.get(url).then(rez => {
    return rez.data;
  });
}

let store = {
    data: {
        EMOJI_ADDRESS,
        EMOJI_ABI,
        contract: hmy.contract(EMOJI_ABI, EMOJI_ADDRESS),
        hmy,
    },
    async GetEmoji(name){
        return await fetchEmoji(`${EMOJI_URL}/${name}.svg`);
    },
    async updateContact(){
      await hmy.login();
      this.data.contract = hmy.contract(EMOJI_ABI, hmy.hmySDK.crypto.fromBech32(EMOJI_ADDRESS));
      return this.data.contract;
    }
}
Vue.prototype.$store = store;