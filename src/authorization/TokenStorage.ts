import { AsyncStorage } from 'react-native';
const jwtDecode = require('jwt-decode');

export class TokenStorage {
  key;
  constructor(key) {
    this.key = key;
  }

  async saveTokens(tokens) {
    return AsyncStorage.setItem(this.key, JSON.stringify(tokens));
  }

  async loadTokens() {
    const tokens = await AsyncStorage.getItem(this.key);
    return (tokens) ? JSON.parse(tokens) : undefined;
  }

  async showUser(){
    const tokens = await this.loadTokens()
    //console.log('tokens', tokens);
    var decoded = jwtDecode(tokens.access_token);
    return decoded.name;

  }

  clearTokens() {
    return AsyncStorage.removeItem(this.key);
  }
}

export let defaultTokenStorage = new TokenStorage('default-token-storage')
