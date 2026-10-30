import React from 'react';
const externalGames = [
  {title:'Fast Vocab', category:'Vocabulary', icon:'🔤', description:'Tezkor lug‘at mashqlari va inglizcha so‘zlarni mustahkamlash.'},
  {title:'Vocab Game', category:'Vocabulary', icon:'🃏', description:'So‘zlarni o‘rganish uchun interaktiv mashqlar.'},
  {title:'Spelling Bee', category:'Spelling', icon:'✍️', description:'Inglizcha so‘zlarning yozilishini mashq qil.'},
  {title:'Fast Quiz', category:'Grammar & Vocabulary', icon:'⚡', description:'Qisqa viktorinalar orqali bilimlaringni sinab ko‘r.'},
  {title:'Anagrams', category:'Vocabulary', icon:'🧩', description:'Harflar bilan ishlash va so‘zlarni topish.'},
  {title:'Grammar Busters', category:'Grammar', icon:'📘', description:'Grammatika bo‘yicha interaktiv mashqlar.'},
];
const source='https://www.gamestolearnenglish.com/';
export default function MiniGamesPage({game}) {
 return <><div className="page-heading"><div><p className="eyebrow">EXTERNAL ENGLISH GAMES</p><h1>Mini o‘yinlar</h1><p className="muted">Tayyor ingliz tili o‘yinlarini tashqi saytda ochib o‘yna. Bu sahifa o‘yinlarni noldan qayta yaratmaydi.</p></div><div className="pill">⚡ {game.xp} XP · 🪙 {game.coins}</div></div><div className="mini-game-grid">{externalGames.map(g=><article key={g.title} className="mini-game-card"><div className="mini-game-art">{g.icon}</div><p className="eyebrow">{g.category}</p><h2>{g.title}</h2><p>{g.description}</p><a className="primary-btn" href={source} target="_blank" rel="noreferrer">Tayyor o‘yinni ochish ↗</a></article>)}</div><div className="panel" style={{marginTop:20}}><h2>Ball va savollar haqida</h2><p className="muted">Tashqi o‘yinlarning ichki savollari va natijalarini Young Adults Kids har doim o‘qiy olmaydi. Shu sababli tashqi saytda olingan ballar bu yerdagi XP/tangaga avtomatik qo‘shilmaydi. Saytimizdagi Grammar va Vocabulary savollari esa ishlatilgan savollar tarixini qurilmada saqlaydi.</p><a href={source} target="_blank" rel="noreferrer">Games to Learn English saytiga o‘tish ↗</a></div></>;
}
