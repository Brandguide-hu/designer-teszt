'use client';

export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 md:px-6 mt-auto">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-[#6B7280]">
          © {new Date().getFullYear()} Hello Yellow. Minden jog fenntartva.
        </p>
      </div>
    </footer>
  );
}
