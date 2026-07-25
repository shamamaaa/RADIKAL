import Logo from "./Logo";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/radik5l/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@radik5l",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M15.5 3v9.8a3.4 3.4 0 1 1-3.4-3.4c.2 0 .4 0 .6.03V12a1.8 1.8 0 1 0 1.6 1.8V3h1.2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M15.5 3c.3 2 1.8 3.5 3.8 3.7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@radik5l",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect
          x="2.5"
          y="5.5"
          width="19"
          height="13"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M10.5 9.2v5.6l5-2.8-5-2.8Z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 text-center">
        <Logo className="h-8 w-8" />

        <div className="flex gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink/60 transition-colors hover:border-ink/30 hover:text-ink"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <p className="max-w-md text-xs leading-relaxed text-ink/40">
          Bu bir hayran sayfasıdır. RADIKAL&apos;in resmi sitesi
          değildir.
        </p>
      </div>
    </footer>
  );
}
