import { RMCharacter, RMCharacterResponse } from "@/types/rickmorty";

const BASE_URL = "https://rickandmortyapi.com/api/character";

/**
 * Página principal → SSG con force-cache.
 * Los datos se generan en build-time y se almacenan estáticamente.
 * No se revalidan: la lista de personajes es estable entre builds.
 */
export async function getCharacters() {
  const res = await fetch(BASE_URL, {
    cache: "force-cache", // SSG: fuerza caché estático en build-time
  });

  if (!res.ok) throw new Error("Error al cargar personajes");

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

  const res = await fetch(`${BASE_URL}/?${query.toString()}`);
  if (!res.ok) return [];

  const data: RMCharacterResponse = await res.json();
  return data.results;
}

/**
 * Detalle de personaje → ISR (revalidate: 864000 = 10 días).
 * Las páginas de detalle se generan estáticamente y se revalidan
 * automáticamente cada 10 días sin necesidad de rebuild manual.
 */
export async function getCharacterById(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    next: { revalidate: 864000 }, // ISR: 10 días en segundos
  });

  if (!res.ok) return null;

  const data: RMCharacter = await res.json();
  return data;
}

/**
 * generateStaticParams → recorre TODAS las páginas de la API para
 * obtener los 826+ personajes y generar sus rutas estáticas por ID.
 */
export async function getAllCharacterParams() {
  const allParams: { slug: string }[] = [];

  // Primera página
  const firstRes = await fetch(BASE_URL, { cache: "force-cache" });
  if (!firstRes.ok) return [];

  const firstData: RMCharacterResponse = await firstRes.json();
  const totalPages = firstData.info.pages;

  // Agregar personajes de la primera página
  firstData.results.forEach((c) => {
    allParams.push({ slug: String(c.id) });
  });

  // Páginas restantes en paralelo para no hacer waterfall
  const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);

  const restResults = await Promise.all(
    pageNumbers.map(async (page) => {
      const res = await fetch(`${BASE_URL}?page=${page}`, {
        cache: "force-cache",
      });
      if (!res.ok) return [];
      const data: RMCharacterResponse = await res.json();
      return data.results;
    })
  );

  restResults.forEach((results) => {
    results.forEach((c) => {
      allParams.push({ slug: String(c.id) });
    });
  });

  return allParams;
}