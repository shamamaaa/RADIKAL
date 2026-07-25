import Image from "next/image";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="RADIKAL"
      width={64}
      height={64}
      className={className}
    />
  );
}
