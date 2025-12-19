'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full py-4 px-4 md:px-6">
      <div className="max-w-4xl mx-auto flex justify-center">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image
            src="/Hello_Yellow_lettering.svg"
            alt="Hello Yellow"
            width={140}
            height={40}
            priority
          />
        </Link>
      </div>
    </header>
  );
}
