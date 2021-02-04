import * as Firebase from 'firebase/app'
import 'firebase/database';
import 'firebase/storage';

export var db = {};// = firebaseApp.database();
export var storage = {};// = firebaseApp.storage();

async function loadFirebaseConfig() {
    let jsonFetch = await fetch("firebase.config.json");
    let firebaseConfig = await jsonFetch.json();
    let firebaseApp = Firebase.initializeApp(firebaseConfig);
    return firebaseApp
    //return firebaseConfig;
}

loadFirebaseConfig().then((firebaseApp)=>{
    db = firebaseApp.database();
    storage = firebaseApp.storage();
})