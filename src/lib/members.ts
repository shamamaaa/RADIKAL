export type MemberId = "vedat" | "yusa" | "ibrahim" | "yusufemre";

export interface Member {
  id: MemberId;
  name: string;
  /** Dative case ("to X") form of the name, e.g. "İbrahim'e" — Turkish suffixes aren't uniform across names. */
  dative: string;
  role: string;
  color: string;
  colorSoft: string;
  photo: string;
}

export const members: Record<MemberId, Member> = {
  vedat: {
    id: "vedat",
    name: "Vedat",
    dative: "Vedat'a",
    role: "Main Vocal",
    color: "#E8332B",
    colorSoft: "#FBDAD8",
    photo: "/images/members/vedat.jpg",
  },
  yusa: {
    id: "yusa",
    name: "Yuşa",
    dative: "Yuşa'ya",
    role: "Lead Dancer",
    color: "#1C7FCB",
    colorSoft: "#D6E9F9",
    photo: "/images/members/yusa.jpg",
  },
  ibrahim: {
    id: "ibrahim",
    name: "İbrahim",
    dative: "İbrahim'e",
    role: "Main Dancer",
    color: "#34A853",
    colorSoft: "#DAF1E1",
    photo: "/images/members/ibrahim.jpg",
  },
  yusufemre: {
    id: "yusufemre",
    name: "Yusuf Emre",
    dative: "Yusuf Emre'ye",
    role: "Sub Vocal",
    color: "#F2A900",
    colorSoft: "#FCEBC7",
    photo: "/images/members/yusufemre.jpg",
  },
};

export const birthdayMemberId: MemberId = "ibrahim";
export const birthdayMember = members[birthdayMemberId];
export const groupPhoto = "/images/members/group.jpg";
