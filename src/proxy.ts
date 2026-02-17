import { NextResponse, NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const timestamp = new Date().toLocaleTimeString();

  console.log(`[${timestamp}] 🚀 ${method} en ${pathname}`);

  if (pathname.startsWith("/api/alumnos")) {
    if (method === "GET") {
      console.log(
        `[${timestamp}] 🔓 Acceso publico concedido (GET) en ${pathname}`,
      );
      return NextResponse.next();
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      console.warn(
        `[${timestamp}] ⚠️ Intento de acceso sin session en ${pathname}`,
      );
      return NextResponse.json(
        { mensaje: "Acceso no autorizado: Debes iniciar sesion" },
        { status: 401 },
      );
    }
    console.info(
      `[${timestamp}] ✅  Usuario ${session.user.email} acceso autorizado en ${pathname}`,
    );
    //permite que continue con la ejecucion
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/api/:path*",
};