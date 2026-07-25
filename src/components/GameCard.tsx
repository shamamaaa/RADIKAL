import Image from "next/image";
import Link from "next/link";
import type { GameDef } from "@/lib/games";

export default function GameCard({ game }: { game: GameDef }) {
  const content = (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-mist">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {game.comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/30 backdrop-blur-[1px]">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wide text-ink">
              Çok Yakında
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-ink">
          {game.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
          {game.description}
        </p>
      </div>
    </>
  );

  const cardClass =
    "group block overflow-hidden rounded-2xl border border-line bg-paper shadow-sm transition-shadow duration-200 hover:shadow-lg";

  if (game.comingSoon || !game.href) {
    return <div className={`${cardClass} cursor-default opacity-90`}>{content}</div>;
  }

  return (
    <Link href={game.href} className={cardClass}>
      {content}
    </Link>
  );
}
