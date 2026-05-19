import Link from "next/link";
import Image from "next/image";
import { getCharacters } from "@/lib/rickmorty";
import { RiAliensFill } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";

// SSG: página generada en build-time con caché estático (force-cache en fetch).
// No revalida automáticamente; se actualiza con cada nuevo deploy.
export const revalidate = false;

/* ── helpers ── */
function getStatusClass(status: string) {
  const s = status.toLowerCase();
  if (s === "alive")   return "badge badge-alive";
  if (s === "dead")    return "badge badge-dead";
  return "badge badge-unknown";
}

function getDotClass(status: string) {
  const s = status.toLowerCase();
  if (s === "alive")   return "status-dot status-dot-alive";
  if (s === "dead")    return "status-dot status-dot-dead";
  return "status-dot status-dot-unknown";
}

export default async function HomePage() {
  const characters = await getCharacters();

  const alive   = characters.filter((c) => c.status.toLowerCase() === "alive").length;
  const dead    = characters.filter((c) => c.status.toLowerCase() === "dead").length;
  const species = new Set(characters.map((c) => c.species)).size;

  return (
    <main className="page-wrapper">
      <div className="page-container">

        <div className="page-header">
          <p className="page-eyebrow">
            <RiAliensFill />
            Universo Rick &amp; Morty
          </p>
          <h1 className="page-title">Explorador de Personajes</h1>
          <p className="page-subtitle">
            Descubre {characters.length} personajes del multiverso. Filtra, busca y conoce cada detalle.
          </p>
        </div>

        <div className="stats-strip">
          <div className="stats-item">
            <span className="stats-number">{characters.length}</span>
            <span className="stats-label">Personajes</span>
          </div>
          <div className="stats-divider" />
          <div className="stats-item">
            <span className="stats-number" style={{ color: "var(--clr-alive)", WebkitTextFillColor: "var(--clr-alive)" }}>
              {alive}
            </span>
            <span className="stats-label">Vivos</span>
          </div>
          <div className="stats-divider" />
          <div className="stats-item">
            <span className="stats-number" style={{ color: "var(--clr-dead)", WebkitTextFillColor: "var(--clr-dead)" }}>
              {dead}
            </span>
            <span className="stats-label">Muertos</span>
          </div>
          <div className="stats-divider" />
          <div className="stats-item">
            <span className="stats-number">{species}</span>
            <span className="stats-label">Especies</span>
          </div>

          <div style={{ marginLeft: "auto" }}>
            <Link href="/search" className="btn-primary">
              <FiSearch size={14} />
              Buscar personaje
            </Link>
          </div>
        </div>

        <div className="character-grid">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/character/${character.id}`}
              className="character-card"
            >
              <div className="card-img-wrapper">
                <Image
                  src={character.image}
                  alt={character.name}
                  width={300}
                  height={300}
                  loading="lazy"
                  className="card-img"
                />
                <div className="card-img-overlay" />
              </div>

              <div className="card-body">
                <h2 className="card-name">{character.name}</h2>
                <div className="card-meta">
                  <span className={getStatusClass(character.status)}>
                    <span className={getDotClass(character.status)} />
                    {character.status}
                  </span>
                  <span className="badge badge-species">{character.species}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}