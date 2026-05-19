import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="mt-4 text-lg">Personaje no encontrado</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-black"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}