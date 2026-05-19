import Image from "next/image";
import Link from "next/link";
import { RMCharacter } from "@/types/rickmorty";

function getStatusClass(status: string) {
  const s = status.toLowerCase();
  if (s === "alive") return "badge badge-alive";
  if (s === "dead")  return "badge badge-dead";
  return "badge badge-unknown";
}

function getDotClass(status: string) {
  const s = status.toLowerCase();
  if (s === "alive") return "status-dot status-dot-alive";
  if (s === "dead")  return "status-dot status-dot-dead";
  return "status-dot status-dot-unknown";
}

export default function CharacterCard({
  character,
}: {
  character: RMCharacter;
}) {
  return (
    <Link href={`/character/${character.id}`} className="character-card">
      {/* Image */}
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

      {/* Body */}
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
  );
}