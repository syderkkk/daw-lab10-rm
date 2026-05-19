import type { Metadata } from "next";
import Link from "next/link";
import { RiAliensFill } from "react-icons/ri";
import { FiHome, FiSearch } from "react-icons/fi";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rick & Morty Explorer",
  description: "Explora el universo de Rick and Morty — personajes, especies y episodios.",
  keywords: ["rick and morty", "personajes", "api", "next.js"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/* ── Navigation ── */}
        <header className="nav">
          <div className="nav-inner">
            {/* Brand */}
            <Link href="/" className="nav-brand">
              <span className="nav-brand-icon">
                <RiAliensFill />
              </span>
              <span className="nav-brand-name">Rick &amp; Morty</span>
            </Link>

            {/* Links */}
            <nav className="nav-links">
              <Link href="/" className="nav-link">
                <FiHome size={14} />
                Inicio
              </Link>
              <Link href="/search" className="btn-primary">
                <FiSearch size={14} />
                Buscar
              </Link>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}