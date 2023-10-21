import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY as string,
  authDomain: `${import.meta.env.VITE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_PROJECT_ID as string,
  storageBucket: `${import.meta.env.VITE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_APP_ID as string
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getTarget() {
  const targetsCol = collection(db, 'target');
  const targetSnapshot = await getDocs(targetsCol);
  const targets = targetSnapshot.docs.map((doc) => doc.data());

  return targets[0];
}

export async function getTemperatures() {
  const temperaturesCol = collection(db, 'temperatures');
  const temperatureSnapshot = await getDocs(temperaturesCol);

  return temperatureSnapshot.docs.map((doc) => doc.data());
}
