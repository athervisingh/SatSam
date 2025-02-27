import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  // collection,
  // writeBatch,
  // query,
  // getDocs,
} from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyAcN1UDEQDgncLWKcQ8RKk3Qqu6IrJbfvg",

  authDomain: "sihsem-c1888.firebaseapp.com",

  projectId: "sihsem-c1888",

  storageBucket: "sihsem-c1888.firebasestorage.app",

  messagingSenderId: "761463147151",

  appId: "1:761463147151:web:09d5a898d24e6b02e83efa",

  measurementId: "G-D4441B0HGP"


};

const firebaseApp = initializeApp(firebaseConfig);

export const sendPasswordReset = async (email) => {
  if (!email) return;
  try {
    await sendPasswordResetEmail(auth, email);
    // console.log("Password reset email sent.");
  } catch (error) {
    // console.error("Error sending password reset email", error);
  }
};


const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>//used
  signInWithPopup(auth, googleProvider);
// export const signInWithGoogleRedirect = () =>
//   signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

// export const addCollectionAndDocuments = async (
//   collectionKey,
//   objectsToAdd,
// ) => {
//   const collectionRef = collection(db, collectionKey);
//   const batch = writeBatch(db);

//   objectsToAdd.forEach((object) => {
//     const docRef = doc(collectionRef, object.title.toLowerCase());
//     batch.set(docRef, object);
//   });

//   await batch.commit();
//   console.log('done');
// };

// export const getCategoriesAndDocuments = async () => {
//   const collectionRef = collection(db, 'categories');
//   const q = query(collectionRef);

//   const querySnapshot = await getDocs(q);
//   return querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
// };

export const createUserDocumentFromAuth = async (//used
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      // console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {//used
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {//used
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);//used

export const onAuthStateChangedListener = (callback) => {//used
  // console.log(auth)
 return onAuthStateChanged(auth, callback);
}