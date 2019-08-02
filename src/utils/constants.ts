
const MAP_ACCESS_TOKEN = 'pk.eyJ1IjoidmpvYmVyIiwiYSI6ImNqeXR2cTRsNTA1OHAzZG55MHBjeGNqZngifQ.P3zuGEjdFNusepcEdz4Z0Q';
const MAP_STYLE = 'mapbox://styles/vjober/cjytz9ox70onl1cmup6h3kkuv';
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyACfzNhKvHBDJgCVwO17sUD7sXZslk_Tf4",
  authDomain: "knights-rides.firebaseapp.com",
  databaseURL: "https://knights-rides.firebaseio.com",
  projectId: "knights-rides",
  storageBucket: "",
  messagingSenderId: "582528975337",
  appId: "1:582528975337:web:3941b4f011ed8121",
}

const constants = Object.freeze({
  MAP_ACCESS_TOKEN,
  FIREBASE_CONFIG,
  MAP_STYLE,
});

export default constants;
export {
  MAP_ACCESS_TOKEN,
  FIREBASE_CONFIG,
  MAP_STYLE,
}
