import { games } from "@/lib/games";
import GameCard from "./GameCard";

export default function GamesSection() {
  return (
    <section id="games" className="scroll-mt-16 bg-paper py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <span className="font-display text-sm font-semibold tracking-[0.3em] text-ink/40">
            MİNİ OYUNLAR
          </span>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Skorunu kanıtla.
          </h2>
          <p className="mt-4 text-lg text-ink/70">
            Her oyunun kendi skor tablosu var. En yüksek skoru yapan
            hayranlar arasına gir.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}
