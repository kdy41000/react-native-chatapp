import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import config from '../firebase.json';

export const app = initializeApp(config);

const auth = getAuth(app);

//로그인
export const signin = async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

//이미지 업로드
const uploadImage = async uri => {
  if (uri.startsWith('https')) {
    return uri;
  }

  const response = await fetch(uri);
  const blob = await response.blob();  //file://형태를 blob으로 변환

  const { uid } = auth.currentUser;
  const storage = getStorage(app);
  const storageRef = ref(storage, `/profile/${uid}/photo.png`);
  await uploadBytes(storageRef, blob, {
    contentType: 'image/png',
  });

  return await getDownloadURL(storageRef);
};

//회원가입
export const signup = async ({ name, email, password, photo }) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const photoURL = await uploadImage(photo);
  await updateProfile(auth.currentUser, { displayName: name, photoURL });
  return user;
};

//현재 인증된 사용자 정보 조회
export const getCurrentUser = () => {
  const { uid, displayName, email, photoURL } = auth.currentUser;
  return { uid, name: displayName, email, photo: photoURL };
};

//프로필 사진 변경
export const updateUserInfo = async photo => {
  const photoURL = await uploadImage(photo);
  await updateProfile(auth.currentUser, { photoURL });
  return photoURL;
};

//로그아웃
export const signout = async () => {
  await signOut(auth);
  return {};
};

//파이어스토어 연결
export const db = getFirestore(app);

//문서(필드) 추가
export const createChannel = async ({ title, desc }) => {
  const channelCollection = collection(db, 'channels');
  const newChannelRef = doc(channelCollection);
  const id = newChannelRef.id;
  const newChannel = {
    id,
    title,
    description: desc,
    createdAt: Date.now(),
  };
  await setDoc(newChannelRef, newChannel);
  return id;
};

//컬렉션 추가
export const createMessage = async ({ channelId },message) => {
  const docRef = doc(db, `channels/${channelId}/messages`, message._id);
  await setDoc(docRef, { ...message, createdAt: Date.now() });
};