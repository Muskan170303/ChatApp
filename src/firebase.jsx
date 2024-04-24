// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";


// // configuring firebase
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyC-iTzLsROmj_8LZ-68a6_jFf37kbjWYyA",
//     authDomain: "chat-app-dd1e2.firebaseapp.com",
//     projectId: "chat-app-dd1e2",
//     storageBucket: "chat-app-dd1e2.appspot.com",
//     messagingSenderId: "860815047684",
//     appId: "1:860815047684:web:d2d28aa537461151414951",
//     measurementId: "G-2YVCT5R70E"
//   };

//   // firebase initialize
// export const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

// export { auth, db, storage };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// configuring firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnFgbPGl0VmnnPUy_9OFfV1Di7vBnuX_Y",
  authDomain: "chatapp-bdefa.firebaseapp.com",
  projectId: "chatapp-bdefa",
  storageBucket: "chatapp-bdefa.appspot.com",
  messagingSenderId: "926515619029",
  appId: "1:926515619029:web:74be29c17fa9749396ee5c",
  measurementId: "G-V3WJEPW9T2"
  };

  // firebase initialize
export const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, storage };