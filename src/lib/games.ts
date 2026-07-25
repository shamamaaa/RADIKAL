import type { MemberId } from "./members";

export interface GameDef {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  memberId: MemberId | null;
  href: string | null;
  comingSoon?: boolean;
}

export const games: GameDef[] = [
  {
    id: "ayran-stack",
    title: "Ayran Stack",
    description:
      "Düşen ayran kutularını devirmeden olabildiğince yükseğe diz. Tek dokunuş, mükemmel zamanlama.",
    thumbnail: "/images/games/ayran-stack-cover.jpg",
    memberId: null,
    href: "/games/ayran-stack",
  },
  {
    id: "ayran-catch",
    title: "Ayran Catch",
    description:
      "Düşen ayran kutularını sepetine topla. Dikkat!!! 3 Şalgam şişesi yakalarsan oyun biter.",
    thumbnail: "/images/games/ayran-catch-cover.jpg",
    memberId: null,
    href: "/games/ayran-catch",
  },
  {
    id: "memory-match",
    title: "Hafıza Oyunu",
    description:
      "Kartları çevir, tüm eşleri bul. Ne kadar az hamlede ve hızlı bitirirsen o kadar yüksek puan alırsın.",
    thumbnail: "/images/games/memory-match-cover.jpg",
    memberId: null,
    href: "/games/memory-match",
  },
];
