import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore/lite';
import { Models } from './models';

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

export module FirebaseService {
  /** Get target temperature */
  export function getTarget() {
    const targetsCol = collection(db, 'target');

    return getDocs(targetsCol).then(
      (data) => data.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Models.Target)[0]
    );
  }

  /** Get sessions */
  export function getSessions() {
    const temperaturesCol = collection(db, 'sessions');
    return getDocs(temperaturesCol).then(
      (data) => data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Models.Session[]
    );
  }

  /** Get temperatures for the session  */
  export function getSessionTemperatures(id: string) {
    const temperaturesCol = collection(db, `sessions/${id}/temperatures`);
    return getDocs(temperaturesCol).then((data) => data.docs.map((doc) => doc.data()) as Models.Temperature[]);
  }

  /** Update target temperature */
  export async function updateTargetTemperature(id: string, temperature: number) {
    const docRef = doc(db, 'target', id);
    return await updateDoc(docRef, { temperature });
  }
}
