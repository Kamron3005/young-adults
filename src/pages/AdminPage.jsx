import React,{useEffect,useState} from 'react';
import {collection,getDocs,addDoc,serverTimestamp,query,orderBy,limit} from 'firebase/firestore';
import {db} from '../firebase.js';
export default function AdminPage({role}){
 const [tab,setTab]=useState('overview'),[users,setUsers]=useState([]),[questions,setQuestions]=useState([]),[games,setGames]=useState([]),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const refresh=async()=>{
  setBusy(true);setMessage('');
  try{
   const [u,q,g]=await Promise.all([
    getDocs(query(collection(db,'userProfiles'),orderBy('createdAt','desc'),limit(100))),
    getDocs(query(collection(db,'adminQuestions'),limit(100))),
    getDocs(query(collection(db,'externalGames'),limit(100)))
   ]);
   setUsers(u.docs.map(d=>({id:d.id,...d.data()})));setQuestions(q.docs.map(d=>({id:d.id,...d.data()})));setGames(g.docs.map(d=>({id:d.id,...d.data()})));
  }catch(e){setMessage('Ma’lumotlarni o‘qib bo‘lmadi. Firestore Rules sozlamalarini tekshiring.')}
  finally{setBusy(false)}
 };
 useEffect(()=>{if(role)refresh()},[role]);
 const addGame=async()=>{const title=prompt('O‘yin nomi:');if(!title)return;const url=prompt('O‘yin havolasi (https://):');if(!url)return;if(!/^https:\/\/\S+/i.test(url)){setMessage('Havola https:// bilan boshlanishi kerak.');return}try{await addDoc(collection(db,'externalGames'),{title,url,createdAt:serverTimestamp()});refresh()}catch{setMessage('O‘yin qo‘shilmadi. Ruxsatlarni tekshiring.')}};
 const addQuestion=async()=>{const text=prompt('Savol matni:');if(!text)return;const answer=prompt('To‘g‘ri javob:');if(!answer)return;try{await addDoc(collection(db,'adminQuestions'),{text,answer,createdAt:serverTimestamp()});refresh()}catch{setMessage('Savol qo‘shilmadi. Ruxsatlarni tekshiring.')}};
 if(!role)return <section className="panel"><h1>Admin bo‘limi</h1><p className="muted">Bu hisobga admin ruxsati berilmagan.</p></section>;
 return <><div className="page-heading"><div><p className="eyebrow">CONTROL CENTER · {role.toUpperCase()}</p><h1>Admin bo‘limi</h1><p className="muted">Young Adults Kids loyihasini boshqarish.</p></div><button className="secondary-btn" onClick={refresh} disabled={busy}>↻ Yangilash</button></div>
 <div className="filter-row">{[['overview','Umumiy'],['users','Foydalanuvchilar'],['questions','Savollar'],['games','O‘yinlar']].map(([id,label])=><button key={id} className={`filter ${tab===id?'active-filter':''}`} onClick={()=>setTab(id)}>{label}</button>)}</div>
 {message&&<p className="auth-error" role="status">{message}</p>}
 {tab==='overview'&&<div className="feature-grid"><div className="panel"><p className="eyebrow">FOYDALANUVCHILAR</p><h2>{users.length}</h2><p className="muted">Yuklangan profil yozuvlari</p></div><div className="panel"><p className="eyebrow">SAVOLLAR</p><h2>{questions.length}</h2><p className="muted">Admin savollar to‘plami</p></div><div className="panel"><p className="eyebrow">TASHQI O‘YINLAR</p><h2>{games.length}</h2><p className="muted">Qo‘shilgan o‘yin havolalari</p></div></div>}
 {tab==='users'&&<section className="panel"><h2>Foydalanuvchilar</h2>{users.map(u=><div className="admin-row" key={u.id}><b>{u.nickname||'Nomsiz'}</b><span>{u.email||u.id}</span><small>{u.role||'player'}</small></div>)}</section>}
 {tab==='questions'&&<section className="panel"><div className="section-title"><h2>Savollar</h2><button className="primary-btn" onClick={addQuestion}>+ Savol qo‘shish</button></div>{questions.map(q=><div className="admin-row" key={q.id}><b>{q.text}</b><span>{q.answer}</span></div>)}</section>}
 {tab==='games'&&<section className="panel"><div className="section-title"><h2>Tashqi o‘yinlar</h2><button className="primary-btn" onClick={addGame}>+ O‘yin qo‘shish</button></div>{games.map(g=><div className="admin-row" key={g.id}><b>{g.title}</b><a href={g.url} target="_blank" rel="noreferrer">O‘yinni ochish ↗</a></div>)}</section>}
 <p className="note">Admin rolini foydalanuvchi o‘zi yoqa olmaydi. Birinchi Super Admin hisobi Firebase Console orqali ishonchli tarzda belgilanishi kerak.</p></>;
}
