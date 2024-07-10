import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBWjDQEiYKdQbQNvoiVvvOn_cbufQzvWuo",
  authDomain: "collabmates-beta.firebaseapp.com",
  databaseURL: "https://collabmates-beta.firebaseio.com",
  projectId: "collabmates-beta",
  storageBucket: "collabmates-beta.appspot.com",
  messagingSenderId: "983690302378",
  appId: "1:983690302378:web:b2fa2c58f2351d5c1b91d3",
  measurementId: "G-R2PXYC9F4S",
};
const vapidKey =
  "BH7RhEM3kdPrZy-TDwOp6dPg7wH2nLa17V_c4DO_jfg-ih1L25fi8gNWxXNWWMK4eAC2-RqE8U5jAoCtjwRlmyo";

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const fcmToken = "";

export const generateToken = async () => {
  const premision = await Notification.requestPermission();
  console.log(premision);

  if (premision === "granted") {
    const token = await getToken(messaging, {
      vapidKey: vapidKey,
    });
    console.log("Token: ", token);
  }
};

// beta
// const config = {
//     apiKey: environment.firebaseConfig.apiKey,
//     apiKey: 'AIzaSyBWjDQEiYKdQbQNvoiVvvOn_cbufQzvWuo',
//     authDomain: 'collabmates-beta.firebaseapp.com',
//     databaseURL: 'https://collabmates-beta.firebaseio.com',
//     projectId: 'collabmates-beta',
//     storageBucket: 'collabmates-beta.appspot.com',
//     messagingSenderId: '983690302378',
//     appId: '1:983690302378:web:b2fa2c58f2351d5c1b91d3',
//     measurementId: 'G-R2PXYC9F4S',
// };

// Prod
// const config = {
//     apiKey: "AIzaSyCmu_u-n31x2WMQlWAciP5RDXGn2qMuXrg",
//     authDomain: "collabmates-3d601.firebaseapp.com",
//     databaseURL: "https://collabmates-3d601.firebaseio.com",
//     projectId: "collabmates-3d601",
//     storageBucket: "collabmates-3d601.appspot.com",
//     messagingSenderId: "645716458793",
//     appId: "1:645716458793:web:779debf3286d6049"
// };

// firebase.initializeApp(config);
// const messaging = firebase.messaging();

// // messaging.usePublicVapidKey('BH7RhEM3kdPrZy-TDwOp6dPg7wH2nLa17V_c4DO_jfg-ih1L25fi8gNWxXNWWMK4eAC2-RqE8U5jAoCtjwRlmyo');
// messaging.usePublicVapidKey('BAyZ_fBA6AKWULBrvP0p-TPLaMU97GA2pMFAFxoU4mKe_XK6vyn9ZBSCR-o6KWWbvkcl55oJoeYR90we9y5b17s');
