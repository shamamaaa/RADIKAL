import Hero from "@/components/Hero";
import MusicSection from "@/components/MusicSection";
import CelebrationSection from "@/components/CelebrationSection";
import GamesSection from "@/components/GamesSection";
import LettersSection from "@/components/LettersSection";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <MusicSection />
      <CelebrationSection />
      <GamesSection />
      <LettersSection />
    </main>
  );
}
