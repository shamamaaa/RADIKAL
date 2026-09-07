# RADIKAL

RADIKAL için Next.js, Tailwind ve Supabase ile hazırlanmış doğum günü kutlama sitesi.

## Başlarken

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresini aç.

## Supabase bağlantısı (genel sayaç + skor tabloları)

Kutlama sayacı ve oyun skor tabloları siteyi ziyaret eden herkes arasında paylaşıldığı
için gerçek bir backend'e ihtiyaç duyar. Bağlanmadan da site çalışır, ama sayaç ve
skorlar her cihazda ayrı ayrı `localStorage`'da tutulur.

1. [supabase.com](https://supabase.com) üzerinden ücretsiz bir proje oluştur.
2. Supabase SQL editöründe [`supabase/schema.sql`](supabase/schema.sql) dosyasını çalıştır.
3. `.env.local.example` dosyasını `.env.local` olarak kopyala ve projenin URL'sini
   ile anon key'ini doldur (Project Settings → API).
4. `npm run dev` komutunu yeniden başlat.

## Gerçek içerikleri yerleştirme

- **Grup fotoğrafı**: `public/images/group-placeholder.svg` dosyasını değiştir ve
  [`src/components/Hero.tsx`](src/components/Hero.tsx) içindeki `src`'yi güncelle.
- **Kutlama videosu**: `public/videos/celebration.mp4` yoluna bir video dosyası ekle
  ([`src/components/CelebrationSection.tsx`](src/components/CelebrationSection.tsx) içinde referans veriliyor).
- **Hakkında metni / üye bilgileri**: [`src/lib/members.ts`](src/lib/members.ts) ile
  `Hero.tsx` içindeki metni düzenle.

## Oyunlar

Her oyun `src/components/games/` altında kendi klasöründe, sayfası ise
`src/app/games/<oyun-id>/` altında yer alır. Oyunlar skor kaydı için
`src/components/Leaderboard.tsx`, `src/components/SubmitScoreForm.tsx` ve
`src/lib/scores.ts` dosyalarını ortak kullanır. Yeni bir oyun eklemek için
`src/lib/games.ts` dosyasına bir kayıt ekle ve `ayran-stack` ya da
`ayran-catch` içindeki yapıyı takip et.

`src/lib/brands.ts` içindeki ayran kutusu / Şalgam şişesi piksel sanatı, gerçek
logolar yerine her üyenin favori markasından ilham alan özgün renk ve
şekiller kullanır. Böylece nostaljiyi korurken tescilli markaları birebir
kullanmamış olur.
