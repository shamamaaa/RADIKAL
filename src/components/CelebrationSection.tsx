"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function CelebrationSection() {
  const [count, setCount] = useState<number | null>(() =>
    isSupabaseConfigured ? null : 0
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [justCelebrated, setJustCelebrated] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    let active = true;

    client
      .from("celebrations")
      .select("count")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (active && data) setCount(data.count);
      });

    const channel = client
      .channel("celebrations-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "celebrations" },
        (payload) => {
          setCount(payload.new.count as number);
        }
      )
      .subscribe();

    return () => {
      active = false;
      client.removeChannel(channel);
    };
  }, []);

  async function handleCelebrate() {
    if (isPlaying) return;

    setJustCelebrated(true);
    setTimeout(() => setJustCelebrated(false), 700);
    setIsPlaying(true);

    if (supabase) {
      const { data, error } = await supabase.rpc(
        "increment_celebration_count"
      );
      if (!error && typeof data === "number") setCount(data);
    } else {
      setCount((c) => (c ?? 0) + 1);
    }
  }

  return (
    <section
      id="kutla"
      className="relative scroll-mt-16 py-24"
      style={{ backgroundColor: "var(--color-ibrahim-soft)" }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <a
          href="https://x.com/search?q=%23happyCJday"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-lg font-semibold tracking-[0.15em] hover:underline"
          style={{ color: "var(--color-ibrahim)" }}
        >
          #happyCJday
        </a>

        <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
           İyi ki doğdun İbrahim 💚
        </h2>
        <p className="mt-4 text-lg text-ink/70">
          Siz de butona tıklayarak İbrahim&apos;i kutlayabilirsiniz 🥳
          <br />
          Sizi sürpriz bir video bekliyor 😚
        </p>

        <div className="mt-10 font-display text-6xl font-bold tabular-nums text-ink sm:text-7xl">
          {count === null ? "—" : count.toLocaleString("tr-TR")}
        </div>
        <div className="mt-1 text-sm font-medium tracking-wide text-ink/50">
          toplam kutlama
        </div>

        <div className="relative mx-auto mt-10 inline-block">
          {justCelebrated && (
            <span
              className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{ backgroundColor: "var(--color-ibrahim)" }}
            />
          )}
          <button
            onClick={handleCelebrate}
            disabled={isPlaying}
            aria-label="Kutla"
            className="relative h-40 w-40 overflow-hidden rounded-full shadow-xl ring-4 ring-white transition-transform active:scale-95 disabled:pointer-events-none disabled:opacity-60"
          >
            <Image
              src="/images/ibo-btn.jpg"
              alt="Kutla"
              fill
              sizes="160px"
              className="object-cover"
            />
          </button>
        </div>

        {!isSupabaseConfigured && (
          <p className="mt-4 text-xs text-ink/40">
            Supabase henüz bağlı değil — sayaç bu cihazda geçici olarak
            gösteriliyor.
          </p>
        )}
      </div>

      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-6">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-ink shadow-2xl">
            <video
              className="aspect-video w-full"
              autoPlay
              playsInline
              onEnded={() => setIsPlaying(false)}
              onError={() => setIsPlaying(false)}
            >
              <source src="/videos/celebration.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
