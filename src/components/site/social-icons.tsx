import type { SVGProps } from "react";

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.3C16.3 4.2 15.4 4.1 14.4 4.1c-2.4 0-4 1.46-4 4.15v2.35H7.9v3h2.5V21h3.1z" />
    </svg>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 5.82c-.9-.86-1.44-2.02-1.5-3.32h-3.02v13.36c0 1.5-1.22 2.72-2.72 2.72a2.72 2.72 0 0 1-2.72-2.72 2.72 2.72 0 0 1 2.72-2.72c.28 0 .55.04.8.12V10.1a5.7 5.7 0 0 0-.8-.06 5.76 5.76 0 0 0-5.76 5.76A5.76 5.76 0 0 0 9.36 21.5a5.76 5.76 0 0 0 5.76-5.76V9.02a8.5 8.5 0 0 0 4.88 1.56V7.56a5.2 5.2 0 0 1-3.4-1.74z" />
    </svg>
  );
}
