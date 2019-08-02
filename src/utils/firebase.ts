import * as firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyACfzNhKvHBDJgCVwO17sUD7sXZslk_Tf4",
  authDomain: "knights-rides.firebaseapp.com",
  databaseURL: "https://knights-rides.firebaseio.com",
  projectId: "knights-rides",
  storageBucket: "",
  messagingSenderId: "582528975337",
  appId: "1:582528975337:web:3941b4f011ed8121",
}

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

export default firebase;
export { database };
