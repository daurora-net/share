import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: "AIzaSyAfYjhti_M_A2TvCcpuFNUjHf7UyhLufLw",
      authDomain: "share-932d3.firebaseapp.com",
      projectId: "share-932d3",
      storageBucket: "share-932d3.appspot.com",
      messagingSenderId: "21128316623",
      appId: "1:21128316623:web:bc9f40818a4f07064e99ba",
      measurementId: "G-KGGEWS48KP"
    }
  )
}

export default firebase