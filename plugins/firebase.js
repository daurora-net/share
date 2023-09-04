import firebase from "firebase";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBmH25Pzv_lGucHWhjmZO-gKXlUkWRpzjg",
    authDomain: "share-7c817.firebaseapp.com",
    projectId: "share-7c817",
    storageBucket: "share-7c817.appspot.com",
    messagingSenderId: "471770970633",
    appId: "1:471770970633:web:b02bc7dccd5bece4bdd6d8",
  });
}

export default firebase;
