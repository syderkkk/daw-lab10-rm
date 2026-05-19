"use client";

import { useEffect, useState } from "react";
import CharacterCard from "@/components/CharacterCard";
import { RMCharacter } from "@/types/rickmorty";
import { RiAliensFill } from "react-icons/ri";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchPage() {
  const [name,    setName]    = useState("");
  const [status,  setStatus]  = useState("");
  const [type,    setType]    = useState("");
  const [gender,  setGender]  = useState("");
  const [results, setResults] = useState<RMCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      const hasQuery = name || status || type || gender;

      if (!hasQuery) {
        setResults([]);
        setSearched(false);
        return;
      }

      try {
        setLoading(true);
        setSearched(true);

        const params = new URLSearchParams();
        if (name)   params.set("name",   name);
        if (status) params.set("status", status);
        if (type)   params.set("type",   type);
        if (gender) params.set("gender", gender);

        const res = await fetch(
          `https://rickandmortyapi.com/api/character/?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!res.ok) { setResults([]); return; }

        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [name, status, type, gender]);

  const handleClear = () => {
    setName("");
    setStatus("");
    setType("");
    setGender("");
  };

  const hasFilters = name || status || type || gender;

  return (
    <main className="page-wrapper">
      <div className="page-container">

        <div className="page-header">
          <p className="page-eyebrow">
            <RiAliensFill />
            Búsqueda Avanzada
          </p>
          <h1 className="page-title">Encuentra tu personaje</h1>
          <p className="page-subtitle">
            Filtra por nombre, estado, tipo o género para descubrir cualquier habitante del multiverso.
          </p>
        </div>

        <div className="search-panel">
          <div className="search-grid">
            <div className="input-group">
              <label className="input-label" htmlFor="search-name">Nombre</label>
              <div style={{ position: "relative" }}>
                <FiSearch
                  size={14}
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--clr-text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="search-name"
                  className="input-field"
                  placeholder="Rick, Morty, Beth…"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: "2.2rem" }}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="search-status">Estado</label>
              <select
                id="search-status"
                className="input-field input-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="alive">Vivo</option>
                <option value="dead">Muerto</option>
                <option value="unknown">Desconocido</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="search-type">Tipo</label>
              <input
                id="search-type"
                className="input-field"
                placeholder="Cronenberg, Parasite…"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="search-gender">Género</label>
              <select
                id="search-gender"
                className="input-field input-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="genderless">Sin género</option>
                <option value="unknown">Desconocido</option>
              </select>
            </div>
          </div>

          {hasFilters && (
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn-outline" onClick={handleClear}>
                <FiX size={13} />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Buscando en el multiverso…</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">🛸</span>
            <p style={{ fontWeight: 600, fontSize: "1rem", color: "var(--clr-text-primary)" }}>
              Ningún personaje encontrado
            </p>
            <p style={{ fontSize: "0.875rem" }}>
              Intenta con otros filtros o revisa la ortografía.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p style={{
              fontSize: "0.8rem",
              color: "var(--clr-text-muted)",
              marginBottom: "1rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>
              {results.length} resultado{results.length !== 1 ? "s" : ""}
            </p>
            <div className="character-grid">
              {results.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          </>
        )}

        {!loading && !searched && (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <p style={{ fontWeight: 600, fontSize: "1rem", color: "var(--clr-text-primary)" }}>
              Escribe algo para comenzar
            </p>
            <p style={{ fontSize: "0.875rem" }}>
              Usa los filtros de arriba para explorar el multiverso.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}