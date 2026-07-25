"use client";

import { FormEvent, useEffect, useState } from "react";
import { members, type MemberId } from "@/lib/members";
import { getSentMemberIds, submitLetter, MESSAGE_MAX_LENGTH } from "@/lib/letters";
import { getSavedPlayerName, NAME_MIN_LENGTH, NAME_MAX_LENGTH } from "@/lib/scores";
import Button from "./ui/Button";
import LetterBoard from "./LetterBoard";

export default function LettersSection() {
  // Starts empty on both server and client so the first client render
  // matches SSR output, then syncs the real localStorage value post-mount.
  const [sentIds, setSentIds] = useState<MemberId[]>([]);
  const [activeMember, setActiveMember] = useState<MemberId | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: syncing from localStorage after mount
    setSentIds(getSentMemberIds());
  }, []);

  return (
    <section id="mektuplar" className="scroll-mt-16 bg-paper py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] text-ink/40">
            MEKTUPLAR
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Hayran mektupları.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/60">
            Her üyeye ayrı bir mektup bırakabilirsin. Kişi başı en fazla dört
            mektup - her üye için bir tane.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(members).map((m) => {
            const sent = sentIds.includes(m.id);
            const isActive = activeMember === m.id;
            return (
              <button
                key={m.id}
                onClick={() => !sent && setActiveMember(isActive ? null : m.id)}
                disabled={sent}
                className="flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-transform disabled:opacity-60 enabled:hover:-translate-y-0.5"
                style={{
                  borderColor: isActive ? m.color : "var(--color-line)",
                  backgroundColor: isActive ? m.colorSoft : "var(--color-mist)",
                }}
              >
                <span
                  className="h-2 w-10 rounded-full"
                  style={{ backgroundColor: m.color }}
                />
                <span className="font-display font-semibold text-ink">
                  {m.name}
                </span>
                <span className="text-xs text-ink/50">
                  {sent ? "Mektup gönderildi ✓" : "Mektup yaz"}
                </span>
              </button>
            );
          })}
        </div>

        {activeMember && (
          <LetterForm
            memberId={activeMember}
            onClose={() => setActiveMember(null)}
            onSent={(id) => {
              setSentIds((prev) => [...prev, id]);
              setActiveMember(null);
            }}
          />
        )}

        <div className="mt-16">
          <LetterBoard />
        </div>
      </div>
    </section>
  );
}

function LetterForm({
  memberId,
  onClose,
  onSent,
}: {
  memberId: MemberId;
  onClose: () => void;
  onSent: (id: MemberId) => void;
}) {
  const member = members[memberId];
  const [name, setName] = useState(getSavedPlayerName());
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim().slice(0, NAME_MAX_LENGTH);
    const trimmedMessage = message.trim().slice(0, MESSAGE_MAX_LENGTH);
    if (
      trimmedName.length < NAME_MIN_LENGTH ||
      !trimmedMessage ||
      submitting
    )
      return;

    setSubmitting(true);
    await submitLetter(memberId, trimmedName, trimmedMessage);
    setSubmitting(false);
    onSent(memberId);
  }

  return (
    <div
      className="mt-8 rounded-2xl border p-6"
      style={{ borderColor: member.color }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p
          className="font-display text-lg font-semibold"
          style={{ color: member.color }}
        >
          {member.dative} mektup yaz
        </p>
        <button
          onClick={onClose}
          className="text-sm text-ink/40 hover:text-ink"
        >
          Vazgeç
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adın"
          minLength={NAME_MIN_LENGTH}
          maxLength={NAME_MAX_LENGTH}
          required
          className="rounded-full border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-ink/30"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`${member.name} için mesajın...`}
          maxLength={MESSAGE_MAX_LENGTH}
          required
          rows={6}
          className="rounded-2xl border border-line px-4 py-3 text-sm text-ink outline-none focus:border-ink/30"
        />
        <p className="-mt-2 self-end text-xs text-ink/40">
          {message.length} / {MESSAGE_MAX_LENGTH}
        </p>
        <Button
          type="submit"
          accentColor={member.color}
          disabled={submitting}
          className="self-end"
        >
          Mektubu gönder
        </Button>
      </form>
    </div>
  );
}
