import type { Profesor } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";

/* =========================
   Helpers
========================= */
const getProfesor = async (id: string): Promise<Profesor | null> => {
  const profesor = await prisma.profesor.findUnique({
    where: { id: Number(id) },
  });

  return profesor;
};

/* =========================
   GET /api/profesores/:id
========================= */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const profesor = await getProfesor(id);
    if (!profesor) {
      return NextResponse.json(
        { mensaje: "Profesor no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(profesor, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { mensaje: "Ocurrió un error al obtener el profesor" },
      { status: 500 },
    );
  }
}

/* =========================
   Zod schema
========================= */
const profesorSchema = z.object({
  nombre: z.string()
    .trim()
    .nonempty("El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener como máximo 50 caracteres"),

  apellido: z.string("El apellido debe ser un string")
    .trim()
    .nonempty("El apellido es obligatorio"),

  email: z.email("Debe ingresar un email válido"),
});

/* =========================
   PUT /api/profesores/:id
========================= */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const profesor = await getProfesor(id);
    if (!profesor) {
      return NextResponse.json(
        { mensaje: "Profesor no encontrado" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const result = profesorSchema.safeParse(body);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });

      return NextResponse.json(errors, { status: 400 });
    }

    const profesorActualizado = await prisma.profesor.update({
      where: { id: Number(id) },
      data: result.data,
    });

    return NextResponse.json(profesorActualizado, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { mensaje: "Ocurrió un error al actualizar el profesor" },
      { status: 500 },
    );
  }
}

/* =========================
   DELETE /api/profesores/:id
========================= */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const profesor = await getProfesor(id);
    if (!profesor) {
      return NextResponse.json(
        { mensaje: "Profesor no encontrado" },
        { status: 404 },
      );
    }

    const profesorEliminado = await prisma.profesor.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(profesorEliminado, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { mensaje: "Ocurrió un error al eliminar el profesor" },
      { status: 500 },
    );
  }
}