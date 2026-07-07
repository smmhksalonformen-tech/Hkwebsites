import Image from "next/image";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "./social-icons";

export function Footer({
  legalName,
  address,
  instagram,
  facebook,
  tiktok,
}: {
  legalName: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}) {
  const socials = [
    { label: "Instagram", href: `https://www.instagram.com/${instagram}/`, Icon: InstagramIcon },
    { label: "Facebook", href: `https://www.facebook.com/${facebook}`, Icon: FacebookIcon },
    { label: "TikTok", href: `https://www.tiktok.com/@${tiktok}`, Icon: TikTokIcon },
  ];

  return (
    <footer className="border-t border-ink-line py-10">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Image src="/logo-cream.png" alt={legalName} width={140} height={60} className="h-8 w-auto" />

        <div className="flex flex-col items-center gap-2.5">
          <p className="font-mono text-[10px] tracking-luxe-sm uppercase text-cream/50">Follow us on our social media</p>
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-line text-cream/70 hover:border-bronze hover:text-bronze transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="text-center sm:text-right text-xs text-cream/40 space-y-0.5">
          <p>{legalName} · {address.split(",").slice(1).join(",").trim()}</p>
          <p>© {new Date().getFullYear()} HK Salon For Men. All rights reserved.</p>
          <p>
            Website design &amp; development by{" "}
            <a
              href="https://trellisdigitalagency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/60 hover:text-bronze transition-colors"
            >
              Trellis Digital Agency
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
