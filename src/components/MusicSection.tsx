const SPOTIFY_ALBUM_ID = "1yGkCrgghH7UJgMalYTSka";
const YOUTUBE_VIDEO_ID = "JaCZ9-G52Jc";
const APPLE_MUSIC_PATH = "us/album/hayran-single/6777525554";

export default function MusicSection() {
  return (
    <section id="muzik" className="scroll-mt-16 bg-mist py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-ink/40">
            MÜZİK
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Hayran&apos;ı dinle.
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <iframe
              title="RADIKAL - Hayran - Spotify"
              src={`https://open.spotify.com/embed/album/${SPOTIFY_ALBUM_ID}?utm_source=generator&theme=0`}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl shadow-sm"
            />

            <div className="relative aspect-video overflow-hidden rounded-xl bg-ink/5 md:aspect-auto md:h-[352px]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
                title="Hayran - Müzik Videosu"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          <iframe
            title="RADIKAL - Hayran - Apple Music"
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            frameBorder="0"
            height="150"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src={`https://embed.music.apple.com/${APPLE_MUSIC_PATH}`}
            className="w-full rounded-xl shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}
