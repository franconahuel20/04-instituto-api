"use client";

import { authClient } from "@/lib/auth-client";

export default function Home() {
  const login = async (provider: "github" | "google") => {
    await authClient.signIn.social({
      provider: provider,
      callbackURL: "/",
    });
  };

  const logout = async () => {
    await authClient.signOut();
    // luego de cerrar sesion pueden redireccionar o recargar el sitio
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Bienvenidos a Instituto API 📕
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Practica de route handler, middleware y autenticacion.
          </p>
          {/* botón github */}
          <button
            onClick={() => login("github")}
            className="mt-4 rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Iniciar sesión con GitHub
          </button>
          {/* Botón Google */}
          <button
            onClick={() => login("google")}
            className="rounded-md border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-50"
          >
            Iniciar sesión con Google
          </button>

          <button
            onClick={logout}
            className="mt-4 rounded-md bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            Cerrar Sesión
          </button>
        </div>
      </main>
    </div>
  );
}