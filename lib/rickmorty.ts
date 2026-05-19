import { RMCharacter, RMCharacterResponse } from "@/types/rickmorty";

const BASE_URL = "https://rickandmortyapi.com/api/character";

/**
 * Página principal → SSG con force-cache.
 * Los datos se generan en build-time y se almacenan estáticamente.
 * No se revalidan: la lista de personajes es estable entre builds.
 */
export async function getCharacters() {
  const res = await fetch(BASE_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "application/json"
    },
    cache: "force-cache", // SSG: fuerza caché estático en build-time
  });

  if (!res.ok) {
    console.error("Error al cargar personajes", res.status, res.statusText, await res.text());
    throw new Error("Error al cargar personajes");
  }

  const data: RMCharacterResponse = await res.json();
  return data.results;
}

/**
 * Búsqueda → CSR (client-side), no se llama desde el servidor.
 */
export async function searchCharacters(params: {
  name?: string;
  status?: string;
  type?: string;
  gender?: string;
}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  const res = await fetch(`${BASE_URL}/?${query.toString()}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "application/json"
    }
  });
  if (!res.ok) return [];

  const data: RMCharacterResponse = await res.json();
  return data.results;
}

export async function getCharacterById(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "application/json"
    },
    next: { revalidate: 864000 },
  });

  if (!res.ok) return null;

  const data: RMCharacter = await res.json();
  return data;
}

/**
 * generateStaticParams → recorre las páginas de la API para generar rutas estáticas.
 */
export async function getAllCharacterParams() {
  const allParams: { slug: string }[] = [];

  const firstRes = await fetch(BASE_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "application/json"
    }
  });
  if (!firstRes.ok) return [];

  const firstData: RMCharacterResponse = await firstRes.json();
  const totalPages = firstData.info.pages;

  firstData.results.forEach((c) => {
    allParams.push({ slug: String(c.id) });
  });

  if (process.env.NODE_ENV === "development") {
    return allParams;
  }

  // Para evitar el error 429 Too Many Requests de Cloudflare durante el build
  // de Next.js, solo pre-renderizamos la primera página (20 personajes).
  // Los demás personajes se generarán on-demand gracias a ISR.
  return allParams;
}
