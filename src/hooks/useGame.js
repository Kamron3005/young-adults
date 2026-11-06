import { useEffect, useState, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import {getAuth } from 'firebase/auth';

async function assignNickname() {
  const user = getAuth().currentUser;

  if (!user) {
    throw new Error('Foydalanuvchi tizimga kirmagan');
  }

  const token = await user.getIdToken();

  const response = await fetch(
    'https://tiny-sun-38e3.raimqulovkamron88.workers.dev/nickname/assign',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Nickname olishda xatolik');
  }

  return data.nickname;
}

const KEY = 'yak-game-v2';

const createInitial = () => ({
  nickname: 'Alfa',
  nicknameChanges: 0,
  xp: 0,
  coins: 120,
  owned: ['cat'],
  activeAnimal: 'cat',
  completed: [],
  answers: 0,
  correct: 0,
  createdAt: Date.now(),
  history: [],
  missionClaims: [],
  regionBadges: []
});

function loadLocal() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? { ...createInitial(), ...JSON.parse(saved) } : createInitial();
  } catch {
    return createInitial();
  }
}

export function useGame(uid) {
  const [game, setGame] = useState(loadLocal);
  const [loaded, setLoaded] = useState(false);
  const firstSnapshot = useRef(true);
  const applyingRemote = useRef(false);

  useEffect(() => {
    if (!uid) {
      setLoaded(false);
      return;
    }

    setLoaded(false);
    firstSnapshot.current = true;
    applyingRemote.current = false;

    const ref = doc(db, 'gameStates', uid);

    const unsubscribe = onSnapshot(ref, async (snap) => {
      if (firstSnapshot.current) {
        firstSnapshot.current = false;

        const assignedNickname = await assignNickname();

        const user = getAuth().currentUser;
const token = await user.getIdToken();

const response = await fetch(
  'https://tiny-sun-38e3.raimqulovkamron88.workers.dev/profile',
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

const profileData = await response.json();

if (!response.ok || !profileData.success) {
  throw new Error('Profile loading failed');
}

const serverProfile = profileData.profile;

if (snap.exists()) {
 const remoteGame = {
  ...createInitial(),
  ...snap.data(),
  nickname: assignedNickname,
  coins: serverProfile.coins,
  xp: serverProfile.xp,
  answers: serverProfile.answers,
  correct: serverProfile.correct
};

  applyingRemote.current = true;
  setGame(remoteGame);
  await setDoc(ref, remoteGame);
} else {
  const initialGame = {
  ...createInitial(),
  nickname: assignedNickname,
  coins: serverProfile.coins,
  xp: serverProfile.xp,
  answers: serverProfile.answers,
  correct: serverProfile.correct
};

  setGame(initialGame);
  await setDoc(ref, initialGame);
}

        setLoaded(true);
        return;
      }

      if (snap.exists()) {
  applyingRemote.current = true;

  setGame(currentGame => ({
    ...createInitial(),
    ...snap.data(),
    coins: currentGame.coins,
    xp: currentGame.xp,
    answers: currentGame.answers,
    correct: currentGame.correct
  }));
  
      }
    }, (error) => {
      console.error('Firestore sync error:', error);
      setLoaded(false);
    });

    return unsubscribe;
  }, [uid]);

  useEffect(() => {
    if (!loaded || !uid) return;

    localStorage.setItem(KEY, JSON.stringify(game));

    if (applyingRemote.current) {
      applyingRemote.current = false;
      return;
    }

    setDoc(doc(db, 'gameStates', uid), game)
      .catch(error => console.error('Save error:', error));
  }, [game, loaded, uid]);

  const award = async (questionId, selected, mode) => {
  try {
    const user = getAuth().currentUser;

    if (!user) {
      return {
        success: false,
        message: 'Avval tizimga kiring.'
      };
    }

    const token = await user.getIdToken();

    const response = await fetch(
      'https://tiny-sun-38e3.raimqulovkamron88.workers.dev/answer',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionId,
          selected,
          mode
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Javob saqlanmadi.'
      };
    }

    setGame(g => ({
      ...g,
      xp: data.profile.xp,
      coins: data.profile.coins,
      answers: data.profile.answers,
      correct: data.profile.correct,
      completed: [...new Set([...g.completed, questionId])],
      history: [...g.history, {
        questionId,
        isCorrect: data.isCorrect,
        mode,
        at: Date.now(),
        xp: data.xp,
        coins: data.coins
      }]
    }));

    return data;

  } catch (error) {
    console.error('Award error:', error);

    return {
      success: false,
      message: 'Server bilan bog‘lanishda xatolik.'
    };
  }
};

  const buyAnimal = (animal) => {
    if (game.owned.includes(animal.id) || game.coins < animal.price) return false;

    setGame(g => ({
      ...g,
      coins: g.coins - animal.price,
      owned: [...g.owned, animal.id]
    }));
    return true;
  };

  const claimMission = (id, reward) => setGame(g => {
    if (g.missionClaims.includes(id)) return g;

    return {
      ...g,
      coins: g.coins + reward.coins,
      xp: g.xp + reward.xp,
      missionClaims: [...g.missionClaims, id]
    };
  });

  const setActiveAnimal = id => setGame(g =>
    g.owned.includes(id) ? { ...g, activeAnimal: id } : g
  );

  const rename = async name => {
  const clean = String(name || '').trim();

  if (!clean) {
    return { ok: false, message: 'Nickname bo‘sh bo‘lishi mumkin emas.' };
  }

  if (clean.toLowerCase() === game.nickname.toLowerCase()) {
    return { ok: false, message: 'Bu hozirgi nickname bilan bir xil.' };
  }

  try {
    const user = getAuth().currentUser;

    if (!user) {
      return { ok: false, message: 'Avval tizimga kiring.' };
    }

    const token = await user.getIdToken();

    const response = await fetch(
      'https://tiny-sun-38e3.raimqulovkamron88.workers.dev/nickname/change',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname: clean })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        ok: false,
        message: data.message || 'Nickname almashtirilmadi.'
      };
    }

    setGame(g => ({
      ...g,
      nickname: data.nickname,
      coins: data.coins,
      nicknameChanges: data.nicknameChanges
    }));

    return {
      ok: true,
      message: 'Nickname muvaffaqiyatli o‘zgartirildi!'
    };

  } catch (error) {
    console.error('Rename error:', error);

    return {
      ok: false,
      message: 'Server bilan bog‘lanishda xatolik.'
    };
  }
};
  const level = Math.floor(game.xp / 100) + 1;
  const reset = () => setGame({ ...createInitial(), createdAt: Date.now() });

  return {
  game,
  level,
  loaded,
  award,
  buyAnimal,
  setActiveAnimal,
  claimMission,
  rename,
  reset
};
}
