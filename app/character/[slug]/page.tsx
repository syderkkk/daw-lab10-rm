import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCharacterById, getAllCharacterParams } from "@/lib/rickmorty";
import {
  FiArrowLeft, FiMapPin, FiGlobe, FiFilm,
  FiCalendar, FiLink
} from "react-icons/fi";
import { RiAliensFill } from "react-icons/ri";

// Cumpliendo con la rúbrica: ISR (Revalidación cada 10 días = 864000 seg)
export const revalidate = 864000;

// Cumpliendo con la rúbrica: Generar rutas estáticas de los personajes
export async function generateStaticParams() {
  return await getAllCharacterParams();
}

/* ── helpers ── */
function getStatusMeta(status: string) {
  const s = status.toLowerCase();
  if (s === "alive")   return { cls: "badge badge-alive",   dot: "status-dot status-dot-alive" };
  if (s === "dead")    return { cls: "badge badge-dead",    dot: "status-dot status-dot-dead" };
  return                      { cls: "badge badge-unknown", dot: "status-dot status-dot-unknown" };
}

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};
function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="detail-info-row">
      <span
        className="detail-info-key"
        style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
      >
        {icon}
        {label}
      </span>
      <span className="detail-info-val">{value}</span>
    </div>
  );
}

/* ── Page ── */
export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const character = await getCharacterById(slug);

  if (!character) return notFound();

  const { cls: statusCls, dot: statusDot } = getStatusMeta(character.status);

  const createdDate = new Date(character.created).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const episodeNumbers = character.episode
    .map((url) => {
      const n = url.split("/").pop();
      return `E${n}`;
    })
    .join("  ·  ");

  return (
    <main className="page-wrapper">
      <div className="page-container">

        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/" className="btn-outline" style={{ display: "inline-flex" }}>
            <FiArrowLeft size={14} />
            Volver al inicio
          </Link>
        </div>

        <div className="detail-wrapper">
          <div className="detail-grid">

            <div>
              <Image
                src={character.image}
                alt={character.name}
                width={320}
                height={320}
                priority
                className="detail-img"
              />
            </div>

            <div>
              <p className="detail-id">ID #{character.id}</p>
              <h1 className="detail-name">{character.name}</h1>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <span className={statusCls}>
                  <span className={statusDot} />
                  {character.status}
                </span>
                <span className="badge badge-species">
                  <RiAliensFill size={10} />
                  {character.species}
                </span>
                {character.type && (
                  <span
                    className="badge"
                    style={{ background: "var(--clr-bg-alt)", color: "var(--clr-text-secondary)" }}
                  >
                    {character.type}
                  </span>
                )}
              </div>

              <div className="divider" />

              <div className="detail-info-grid">
                <InfoRow
                  icon={<FiGlobe size={11} />}
                  label="Género"
                  value={character.gender}
                />

                <InfoRow
                  icon={<FiMapPin size={11} />}
                  label="Origen"
                  value={
                    character.origin.url ? (
                      <a
                        href={character.origin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--clr-blue-500)" }}
                      >
                        {character.origin.name}
                      </a>
                    ) : (
                      character.origin.name
                    )
                  }
                />

                <InfoRow
                  icon={<FiMapPin size={11} />}
                  label="Ubicación"
                  value={
                    character.location.url ? (
                      <a
                        href={character.location.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--clr-blue-500)" }}
                      >
                        {character.location.name}
                      </a>
                    ) : (
                      character.location.name
                    )
                  }
                />

                <InfoRow
                  icon={<FiFilm size={11} />}
                  label="Episodios"
                  value={
                    <span className="detail-episodes-badge">
                      {character.episode.length} ep.
                    </span>
                  }
                />

                <InfoRow
                  icon={<FiFilm size={11} />}
                  label="Lista ep."
                  value={
                    <span
                      style={{
                        fontSize: "0.75rem",
                        lineHeight: 1.8,
                        color: "var(--clr-text-secondary)",
                        wordBreak: "break-word",
                      }}
                    >
                      {episodeNumbers}
                    </span>
                  }
                />

                <InfoRow
                  icon={<FiCalendar size={11} />}
                  label="Creado"
                  value={createdDate}
                />

                <InfoRow
                  icon={<FiLink size={11} />}
                  label="API URL"
                  value={
                    <a
                      href={character.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--clr-blue-500)", wordBreak: "break-all" }}
                    >
                      {character.url}
                    </a>
                  }
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}