import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="hidden lg:flex rounded-xl border items-center justify-between border-border bg-card px-4 py-2 mx-4 text-sm">
      <div className="text-primary">
        © {new Date().getFullYear()}{' '}
        <Link
          href="https://asianliftbd.com/"
          target="_blank"
          className="text-primary hover:text-sky-500"
        >
          Asian Lift Bangladesh
        </Link>
        . All Rights Reserved.
      </div>
      <div className="flex space-x-4">
        <Link
          href="https://asianliftbd.com/privacy-policy"
          target="_blank"
          className="text-primary hover:text-sky-500"
        >
          Privacy Policy
        </Link>
        <Link
          href="https://asianliftbd.com/terms-of-use"
          target="_blank"
          className="text-primary hover:text-sky-500"
        >
          Terms Of Use
        </Link>
      </div>
    </footer>
  );
}
