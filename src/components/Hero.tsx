import { ImageSwiper } from "./ui/ImageSwiper";
import { groupPhoto, members } from "@/lib/members";

const swiperImages = [
  groupPhoto,
  members.vedat.photo,
  members.yusa.photo,
  members.ibrahim.photo,
  members.yusufemre.photo,
].join(",");

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-16 pb-16 lg:grid-cols-2 lg:items-center lg:pt-20 lg:pb-24">
        <div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            <span style={{ color: "var(--color-ibrahim)" }}>RADIKAL</span> hakkında :
          </h1>

          <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-ink/70">
            <p>
              Radikal, müziği, dansı ve sahne performansını tek bir kimlikte
              buluşturan Türkiye&apos;nin yeni nesil erkek müzik grubudur.
              Vedat Çelik, Yusuf Emre Akbıyık, Yuşa Akbıyık ve İbrahim Can
              Kaya&apos;dan oluşan dörtlü, Universal Music ile 19 Haziran
              2026&apos;da yayınladıkları ilk tekileri &quot;Hayran&quot; ile
              kariyerlerine iddialı bir giriş yaptı.
            </p>
            <p>
              Grubun adı hem &quot;kök&quot; hem de ani ve güçlü bir değişim
              anlamını taşıyor - bu da Radikal&apos;in müzikal duruşunu
              özetliyor. Söz ve bestesi grubun ana vokali Vedat Çelik&apos;e
              ait olan &quot;Hayran&quot;, 2000&apos;lerin pop estetiğine göz
              kırpan klibiyle dikkat çekti. Modern prodüksiyonu, güçlü
              koreografileri ve kendilerine has görsel kimlikleriyle Radikal,
              Türkiye&apos;de uzun süredir sessiz kalan boyband kültürünü
              yeniden canlandırmaya hazır.
            </p>
            <p className="text-sm text-ink/50">- Radz ⭐️</p>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ImageSwiper images={swiperImages} cardWidth={320} cardHeight={420} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden justify-center pb-6 sm:flex">
        <div className="flex flex-col items-center gap-1 text-ink/40">
          <span className="text-[10px] font-semibold tracking-[0.3em]">
            AŞAĞI KAYDIR
          </span>
          <span className="h-8 w-px animate-pulse bg-ink/30" />
        </div>
      </div>
    </section>
  );
}
