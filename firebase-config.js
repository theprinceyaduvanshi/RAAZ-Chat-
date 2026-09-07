const firebaseConfig = {
  apiKey: "AIzaSyAgEUWI8qBLTobFK5P0s7ljeFN0hIJ96dw",
  authDomain: "raaz-34b4d.firebaseapp.com",
  projectId: "raaz-34b4d",
  storageBucket: "raaz-34b4d.firebasestorage.app",
  messagingSenderId: "984604144983",
  appId: "1:984604144983:web:6fdc71386b241160eafa12"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();