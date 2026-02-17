import prisma from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'
import z from "zod";

export async function GET(_request: Request) {
  try {
    const profesores = await prisma.profesor.findMany();
    return NextResponse.json(profesores, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { mensaje: "Ocurrio un error al listar los profesores" },
      { status: 500 }
    );
  }
}

const profesorSchema = z.object({
  nombre: z
    .string()
    .trim()
    .nonempty("El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener como máximo 50 caracteres"),

  apellido: z
    .string()
    .trim()
    .nonempty("El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido debe tener como máximo 50 caracteres"),

  email: z.string().trim().email("Debe ingresar un email valido"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = profesorSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = (issue.path[0] as string) ?? "general";
        errors[field] = issue.message;
      });
      return NextResponse.json(errors, { status: 400 });
    }

    const profesorNuevo = await prisma.profesor.create({
      data: result.data, // usar data validada, no el body crudo
    });

    return NextResponse.json(profesorNuevo, { status: 201 });
  } catch (error: any) {
    console.error(error);

    // Opcional: manejo prolijo de email duplicado (Postgres/Prisma)
    if (error?.code === "P2002") {
      return NextResponse.json(
        { email: "Ya existe un profesor con ese email" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { mensaje: "Ocurrio un error al crear un profesor" },
      { status: 500 }
    );
  }
}
