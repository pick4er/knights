import * as firebase from 'firebase/app';
import 'firebase/database';

import { FIREBASE_CONFIG } from './constants';

firebase.initializeApp(FIREBASE_CONFIG);

const database = firebase.database();

export default firebase;
export { database };
