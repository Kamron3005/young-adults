import {useEffect,useState} from 'react';
const KEY='yak-game-v2';
const initial={nickname:'Alfa' ,nicknameChanges:0,xp:0,coins:120,owned:['cat'],activeAnimal:'cat',completed:[],answers:0,correct:0,createdAt:Date.now(),history:[],missionClaims:[],regionBadges:[]};
export function useGame(){
 const [game,setGame]=useState(()=>{try{return {...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return initial}});
 useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(game))},[game]);
 const award=(questionId,isCorrect,mode)=>setGame(g=>{if(g.completed.includes(questionId))return g;const xp=isCorrect?10:2;const coins=isCorrect?5:1;return {...g,xp:g.xp+xp,coins:g.coins+coins,answers:g.answers+1,correct:g.correct+(isCorrect?1:0),completed:[...g.completed,questionId],history:[...g.history,{questionId,isCorrect,mode,at:Date.now(),xp,coins}]}});
 const buyAnimal=(animal)=>{let result=false;setGame(g=>{if(g.owned.includes(animal.id)||g.coins<animal.price)return g;result=true;return {...g,coins:g.coins-animal.price,owned:[...g.owned,animal.id]}});return result};
 const claimMission=(id,reward)=>setGame(g=>{if(g.missionClaims.includes(id))return g;return {...g,coins:g.coins+reward.coins,xp:g.xp+reward.xp,missionClaims:[...g.missionClaims,id]}});
 const setActiveAnimal=id=>setGame(g=>g.owned.includes(id)?{...g,activeAnimal:id}:g);
 const rename=name=>{let result={ok:false,message:''};setGame(g=>{const clean=name.trim();if(!clean){result.message='Nickname bo‘sh bo‘lishi mumkin emas.';return g}if(clean.toLowerCase()===g.nickname.toLowerCase()){result.message='Bu hozirgi nickname bilan bir xil.';return g}if(g.nicknameChanges>0&&g.coins<250){result.message='Nickname almashtirish uchun 250 tanga kerak.';return g}result={ok:true,message:g.nicknameChanges===0?'Nickname saqlandi!':'Nickname o‘zgartirildi. 250 tanga sarflandi.'};return {...g,nickname:clean,coins:g.coins-(g.nicknameChanges>0?250:0),nicknameChanges:g.nicknameChanges+1}});return result};
 const level=Math.floor(game.xp/100)+1;
 const reset=()=>setGame({...initial,createdAt:Date.now()});
 return {game,level,award,buyAnimal,setActiveAnimal,claimMission,rename,reset};
}
