import React,{useEffect,useState} from 'react';
import {onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,sendPasswordResetEmail,updateProfile} from 'firebase/auth';
import {doc,runTransaction,serverTimestamp,getDoc} from 'firebase/firestore';
import {db} from '../firebase.js';
import {auth} from '../firebase.js';

const nickLeft=['Nova','Shadow','Pixel','Frost','Thunder','Mystic','Blaze','Neon','Storm','Cyber','Lucky','Silver','Golden','Rapid','Clever','Brave','Magic','Cosmic','Sunny','Royal','Turbo','Crystal','Wild','Happy','Star'];
const nickRight=['Fox','Wolf','Tiger','Dragon','Panda','Owl','Falcon','Rabbit','Eagle','Phoenix','Lion','Dolphin','Koala','Penguin','Deer','Turtle','Bear','Lynx','Otter','Comet','Ranger','Ninja','Wizard','Spark','Knight','Rocket','Cobra','Butterfly','Jaguar','Whale','Unicorn','Falcon','Badger','Moose','Hawk','Robin','Gecko','Manta','Orca','Parrot'];
async function assignUniqueNickname(user){
 const pairs=[];
 for(const a of nickLeft) for(const b of nickRight) pairs.push(`${a}${b}`);
 // Shuffle deterministically enough for candidate ordering; uniqueness is enforced by Firestore transaction.
 for(let i=pairs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pairs[i],pairs[j]]=[pairs[j],pairs[i]];}
 for(const nickname of pairs){
  const key=nickname.toLowerCase();
  const nickRef=doc(db,'nicknames',key);
  const profileRef=doc(db,'userProfiles',user.uid);
  try{
   await runTransaction(db,async tx=>{
    const profile=await tx.get(profileRef);
    if(profile.exists() && profile.data().nickname) return profile.data().nickname;
    const taken=await tx.get(nickRef);
    if(taken.exists()) throw new Error('NICK_TAKEN');
    tx.set(nickRef,{uid:user.uid,nickname,createdAt:serverTimestamp()});
    tx.set(profileRef,{uid:user.uid,email:user.email||'',nickname,role:'player',createdAt:serverTimestamp()},{merge:true});
   });
   return nickname;
  }catch(error){if(error.message!=='NICK_TAKEN') throw error;}
 }
 throw new Error('Bo‘sh nickname qolmadi. Keyinroq urinib ko‘ring.');
}
export default function AuthGate({children}){
 const [user,setUser]=useState(undefined),[mode,setMode]=useState('login'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>onAuthStateChanged(auth,async current=>{
  setUser(current);
  if(current){
   try{
    const profile=await getDoc(doc(db,'userProfiles',current.uid));
    if(!profile.exists()||!profile.data().nickname){
     const nickname=await assignUniqueNickname(current);
     if(current.displayName!==nickname) await updateProfile(current,{displayName:nickname});
    }
   }catch(error){console.error('Nickname profile setup failed:',error)}
  }
 }),[]);
 if(user===undefined)return <div className="auth-screen"><div className="panel">Yuklanmoqda…</div></div>;
 if(user)return <>{children}</>;
 const run=async(fn)=>{setBusy(true);setError('');try{await fn()}catch(e){setError(e.code==='auth/email-already-in-use'?'Bu email allaqachon ro‘yxatdan o‘tgan.':e.code==='auth/invalid-credential'?'Email yoki parol noto‘g‘ri.':e.message||'Xatolik yuz berdi.')}finally{setBusy(false)}};
 return <div className="auth-screen"><form className="panel auth-panel" onSubmit={e=>{e.preventDefault();if(mode==='signup'&&password!==confirm){setError('Parollar mos emas.');return}run(async()=>{if(mode==='signup'){const c=await createUserWithEmailAndPassword(auth,email,password);const nickname=await assignUniqueNickname(c.user);await updateProfile(c.user,{displayName:nickname})}else await signInWithEmailAndPassword(auth,email,password)})}}><img src="/images/young-adults-logo.svg" alt="Young Adults"/><p className="eyebrow">WELCOME ADVENTURER</p><h1>{mode==='signup'?'Hisob yaratish':'Xush kelibsiz!'}</h1><p className="muted">{mode==='signup'?'Young Adults Kids olamiga qo‘shiling.':'Hisobingizga kiring va davom eting.'}</p><label>Email</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/><label>Parol</label><input type="password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Kamida 6 belgi"/>{mode==='signup'&&<><label>Parolni tasdiqlang</label><input type="password" required value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Parolni qayta kiriting"/></>}{error&&<p className="auth-error" role="alert">{error}</p>}<button className="primary-btn" disabled={busy}>{busy?'Kuting…':mode==='signup'?'Sign Up':'Sign In'}</button><button type="button" className="secondary-btn" disabled={busy} onClick={()=>run(()=>signInWithPopup(auth,new GoogleAuthProvider()))}>Google orqali davom etish</button><button type="button" className="auth-switch" onClick={()=>{setMode(mode==='signup'?'login':'signup');setError('')}}>{mode==='signup'?'Hisobingiz bormi? Sign In':'Hisobingiz yo‘qmi? Sign Up'}</button>{mode==='login'&&<button type="button" className="text-btn" onClick={()=>email&&run(()=>sendPasswordResetEmail(auth,email))}>Parolni unutdingizmi?</button>}</form></div>;
}
