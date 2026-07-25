import type { MemberId } from "./members";

/**
 * Pixel-art sprites for the ayran brand each member is nostalgic for,
 * plus vector fallback colors used while the image is still loading.
 */
export interface AyranSkin {
  id: string;
  memberId: MemberId;
  label: string;
  image: string;
  cupColor: string;
  swirlColor: string;
  lidColor: string;
  textColor: string;
}

export const ayranSkins: AyranSkin[] = [
  {
    id: "sutas",
    memberId: "yusa",
    label: "Sütaş",
    image: "/images/ayran/sutas.png",
    cupColor: "#eaf4fb",
    swirlColor: "#1c7fcb",
    lidColor: "#ffffff",
    textColor: "#1c5a8f",
  },
  {
    id: "yorsan",
    memberId: "yusufemre",
    label: "Yörsan",
    image: "/images/ayran/yorsan.png",
    cupColor: "#fff6df",
    swirlColor: "#f2a900",
    lidColor: "#ffffff",
    textColor: "#8a5c00",
  },
  {
    id: "eker",
    memberId: "vedat",
    label: "Eker",
    image: "/images/ayran/eker.png",
    cupColor: "#ffffff",
    swirlColor: "#e8332b",
    lidColor: "#e8332b",
    textColor: "#a11f19",
  },
  {
    id: "sek-naneli",
    memberId: "ibrahim",
    label: "Sek Naneli",
    image: "/images/ayran/sek-naneli.png",
    cupColor: "#eaf8ee",
    swirlColor: "#34a853",
    lidColor: "#2f9647",
    textColor: "#1f6b34",
  },
];

export const salgamSkin = {
  id: "salgam",
  label: "Şalgam",
  image: "/images/ayran/salgam.png",
  bottleColor: "#5b1030",
  capColor: "#ffffff",
  neckColor: "#e8a9c0",
  textColor: "#ffffff",
};
