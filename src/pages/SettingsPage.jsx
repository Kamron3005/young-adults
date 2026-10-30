import React,{useEffect,useState} from 'react';
export default function SettingsPage({onSignOut}){
 const [motion,setMotion]=useState(()=>localStorage.getItem('yak-motion')||'full');
 const [notice,setNotice]=useState('');
 useEffect(()=>{document.documentElement.dataset.motion=motion;localStorage.setItem('yak-motion',motion)},[motion]);
 return <><div className="page-heading"><div><p className="eyebrow">PREFERENCES</p><h1>Sozlamalar</h1><p className="muted">Hisob va sayt ko‘rinishini boshqarish.</p></div></div>
 <div className="settings-grid">
 <section className="panel"><p className="eyebrow">✨ KO‘RINISH</p><h2>Animatsiyalar</h2><p className="muted">Saytdagi harakat effektlari darajasini tanlang.</p><div className="setting-options">{[['full','To‘liq','Barcha effektlar'],['reduced','Kamaytirilgan','Faqat muhim effektlar'],['off','O‘chirilgan','Harakatsiz ko‘rinish']].map(([v,t,d])=><button key={v} className={`setting-option ${motion===v?'selected':''}`} onClick={()=>setMotion(v)}><b>{t}</b><small>{d}</small></button>)}</div></section>
 <section className="panel"><p className="eyebrow">🔔 BILDIRISHNOMALAR</p><h2>Eslatmalar</h2><p className="muted">Kunlik eslatmalarni keyingi versiyada yoqish mumkin.</p><span className="level-badge">Hozircha mavjud emas</span></section>
 <section className="panel"><p className="eyebrow">🔐 HISOB</p><h2>Xavfsizlik</h2><p className="muted">Parolni tiklash va hisob boshqaruvi kirish tizimi to‘liq sozlangach faollashtiriladi.</p><button className="danger-btn" onClick={()=>{onSignOut?.()}}>Hisobdan chiqish</button>{notice&&<p role="status">{notice}</p>}</section>
 </div></>;
}
