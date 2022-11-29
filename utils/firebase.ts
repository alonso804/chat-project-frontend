import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChebTZdkJU1-VoVcJ7rnvWhmNyZcZ4SCw",
  authDomain: "utec-chat-ui.firebaseapp.com",
  projectId: "utec-chat-ui",
  storageBucket: "utec-chat-ui.appspot.com",
  messagingSenderId: "562546075361",
  appId: "1:562546075361:web:ab027ed3a80caac3cd79a0",
  measurementId: "G-WDXLJ9Y0LR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
