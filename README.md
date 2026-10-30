# Young Adults Kids

React + Vite English-learning game prototype.

## Run locally
1. Install Node.js (LTS).
2. Run `npm install`.
3. Run `npm run dev`.
4. For production check, run `npm run build`.

## Included in this update
- Companion cards now show each animal's ability under its art.
- Phoenix art asset is included in `public/images/phoenix-art.png`.
- Profile includes ten preset avatars and local image upload (PNG/JPG/WEBP/GIF, up to 2 MB).
- Mission page shows claimed-reward count and titles earned from completed missions.
- Missing Letter and Word Scramble accept typed answers instead of multiple-choice options.
- Responsive styles for typed-answer controls.

## Important limitations
- Profile images are saved only in the current browser/device. There is no server-side image-content moderation yet; therefore the app cannot reliably block all 18+ or otherwise inappropriate images. Do not deploy user uploads for children until server-side moderation, secure storage, and reporting/guardian controls are implemented.
- Nicknames, progress, rewards, and mission totals are local-demo data. A true global leaderboard, cross-device sync, account security, and globally unique nicknames require a backend.
- Mini-game question pools are finite; this prototype does not guarantee unlimited unique questions. Expand the question bank and persist per-user used-question IDs before claiming permanent no-repeat behavior.
- Build verification was attempted, but dependency installation timed out in this environment. Please run `npm install` and `npm run build` locally before deployment.


## Yangi qo‘shilgan imkoniyatlar

- Sign Up sahifasidagi Sign In / Sign Up almashish tugmasi aniqroq va mobilga mos ko‘rinishga keltirildi.
- Ro‘yxatdan o‘tgan foydalanuvchiga Firestore tranzaksiyasi orqali bo‘sh nickname ajratiladi. Nickname bandligi `nicknames` kolleksiyasida tekshiriladi.
- Admin panel: foydalanuvchilar ro‘yxati, admin savollari va tashqi o‘yin havolalarini ko‘rish/boshqarish.

## Admin panelni birinchi marta yoqish

1. Firebase Console → Authentication → Users bo‘limidan o‘zingizning hisobingiz UID raqamini oling.
2. Firestore Database → Data bo‘limida `admins` nomli collection yarating.
3. Document ID sifatida aynan UID ni kiriting.
4. Hujjat maydoni: `role` (string) = `superadmin`.
5. Loyihaga qo‘shilgan `firestore.rules` qoidalarini Firebase Console → Firestore Database → Rules bo‘limiga joylab, Publish bosing.

Admin huquqini sayt ichidagi oddiy foydalanuvchi o‘ziga bera olmaydi. Birinchi Super Admin huquqi Firebase Console orqali qo‘lda beriladi. `firestore.rules` qoidalarini nashr qilmasdan Firestore bilan ishlashni ommaga ochmang. Firebase API kalitini maxfiy parol deb hisoblash shart emas, lekin Firestore Rules va Authentication himoyasi majburiy.
