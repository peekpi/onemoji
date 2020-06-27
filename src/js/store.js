import Vue from 'vue';
import axios from 'axios';
import hmy from './hmy.js';

window.hmy = hmy;
const EMOJI_ABI = require('./emoji.sol.json');
const EMOJI_ADDRESS = 'one1kml3y2emq6fmh6ea7vta5r33rwd09rku2z5mpl';

const EMOJI_URL = 'https://raw.githubusercontent.com/peekpi/nftymoji/master/emoji'
//const EMOJI_URL = '../emoji';
//const EMOJI_URL = 'emoji';
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
        txlist: [],
        hmy,
    },
    async GetEmoji(name){
        return await fetchEmoji(`${EMOJI_URL}/${name}.svg`);
    },
    async updateContact(){
      await hmy.login();
      this.data.contract = hmy.contract(EMOJI_ABI, hmy.hmySDK.crypto.fromBech32(EMOJI_ADDRESS));
      return this.data.contract;
    },
    async txCommit(tx) {
      await hmy.txSignSend(tx);
      this.data.txlist.push(tx);
      return tx.confirm(tx.id, 5)
    }
}
Vue.prototype.$store = store;