import { supabase } from "./supabase";
import type { MemberId } from "./members";

export interface LetterRow {
  id: string;
  member_id: MemberId;
  sender_name: string;
  message: string;
  created_at: string;
  is_creator?: boolean;
}

const SENT_KEY = "radikal_letters_sent";
const LOCAL_LETTERS_KEY = "radikal_letters_local";
const UNLOCK_KEY = "radikal_letters_unlocked";

export const MESSAGE_MAX_LENGTH = 5000;

export const creatorLetters: LetterRow[] = [
  {
    id: "creator-ibrahim",
    member_id: "ibrahim",
    sender_name: "Shamama(@schamamaa) ⭐",
    message:
      "İBOOOOO MERHABAA, CANIM BIASIM! 🎂 Sen hayran olmayabilirsin ama biz sana gerçekten hayranız yaaa DOĞUM GÜNÜN KUTLU OLSUNNNN 🥳 Umarım hediyelerimiz sana ulaştığında beğenirsin. Gönül isterdi daha çok şey hazırlamak ama Türkiye'de olmadığım için maalesef ((( Yine de senin için birkaç hediye aldım ve saklıyorum Berlin'e yolun düşerse seni bulup vermem gerek sanırım, ya da konseriniz için Türkiye'ye gelirsem artık o zaman veririm.. Yeni yaşında bol bol seni sahnede izleyelim, enerjine bayılıyoruzz. Lafı çok uzatıp seni baymak istemiyorum, yeni yaşın bol bol başarı, şans ve şöhret getirsin. You deserve it 💚",
    created_at: "2026-07-25T00:00:00.000Z",
    is_creator: true,
  },
  {
    id: "creator-yusufemre",
    member_id: "yusufemre",
    sender_name: "Shamama(@schamamaa) ⭐",
    message:
      "Yusuf Emre merhabaaa! Umarım siteyi beğenmişsinizdir 🥰 Hepinize teker teker uzun uzun yazıp bıktırmak istemiyorum. Seni zaten sosyal medyadan tanıyordum ve grupta olduğunu görünce çoook sevindim. O kadar tatlısın ki sana edecek güzel laf bulamıyorum artıkkkk, minnoşluğunu ifade edecek bir söz yokkk 🫶 Ve aynı zamanda çok yeteneklisin.Kalbinin güzelliği yüzüne vurmuş gerçekten 💛 Umarım en kısa sürede karşılaşırız, hepinizi çok seviyorum!",
    created_at: "2026-07-25T00:00:00.000Z",
    is_creator: true,
  },
  {
    id: "creator-yusa",
    member_id: "yusa",
    sender_name: "Shamama(@schamamaa) ⭐",
    message:
      "YUŞAAAA! Big5'ta seni izlediğimde dedim baba tamam ya, hemen boyband kurun, bu çocuk çıkış yapsın CİDDEN İÇİMDEN GEÇTİ BUNLAR 😭 Kameraya o kadar yakışıyorsun kiiii anlatamam yani. Sueda, Batu ve senin olduğunuz fotoyu poster yapıp odama asacağım sanırım… yüzyılın fotoğrafı oldu benim için ÇOOOK SEVİLİYORSUNNN 💙 Başarılı olacağınıza eminim zaten. Kendimden küçüklere fangirllük yaparken benim mahcubiyet… neyse yaaa love youuu",
    created_at: "2026-07-25T00:00:00.000Z",
    is_creator: true,
  },
  {
    id: "creator-vedat",
    member_id: "vedat",
    sender_name: "Shamama(@schamamaa) ⭐",
    message:
      "Vedat merhabaaa! Umarım siteyi beğenmişsinizdir, mektup kısmını Besti hayranlarından ilham alarak yaptım🥰 Seni zaten Lidya ile birlikte tanımıştım ve çıkış yapacağınızı öğrendiğim günden beri resmen gün saydım. Hepiniz çok yeteneklisiniz, bizim için pişireceklerinizi çok merakla bekliyorummm. Umarım seni bodrumda uzun tutmazlarrr 😭  Çok uzatıp seni yormak istemiyorum. Bu yaşımda beni fangirl dönemime geri döndürdüğünüz için teşekkürler, love you all <3 VE LÜTFEN İLK YURT DIŞI KONSERİNİZİ BERLİN'DE VERİN!!",
    created_at: "2026-07-25T00:00:00.000Z",
    is_creator: true,
  },
];

export function getSentMemberIds(): MemberId[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(SENT_KEY);
  return raw ? JSON.parse(raw) : [];
}

function markSent(memberId: MemberId) {
  if (typeof window === "undefined") return;
  const current = getSentMemberIds();
  if (!current.includes(memberId)) {
    window.localStorage.setItem(
      SENT_KEY,
      JSON.stringify([...current, memberId])
    );
  }
}

function getLocalLetters(): LetterRow[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(LOCAL_LETTERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveLocalLetter(row: LetterRow) {
  if (typeof window === "undefined") return;
  const rows = getLocalLetters();
  rows.push(row);
  window.localStorage.setItem(LOCAL_LETTERS_KEY, JSON.stringify(rows));
}

export async function submitLetter(
  memberId: MemberId,
  senderName: string,
  message: string
): Promise<void> {
  markSent(memberId);

  if (!supabase) {
    saveLocalLetter({
      id: crypto.randomUUID(),
      member_id: memberId,
      sender_name: senderName,
      message,
      created_at: new Date().toISOString(),
    });
    return;
  }

  await supabase
    .from("letters")
    .insert({ member_id: memberId, sender_name: senderName, message });
}

export async function fetchLetters(): Promise<LetterRow[]> {
  let userLetters: LetterRow[] = [];

  if (!supabase) {
    userLetters = getLocalLetters();
  } else {
    const { data, error } = await supabase
      .from("letters")
      .select("id, member_id, sender_name, message, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      userLetters = data;
    }
  }

  return [...creatorLetters, ...userLetters];
}

export function isBoardUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(UNLOCK_KEY) === "1";
}

export function unlockBoard() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(UNLOCK_KEY, "1");
}
