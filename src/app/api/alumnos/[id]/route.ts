import type { Alumno } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import z from "zod";

const getAlumno = async (id: string): Promise<Alumno | null> => {
  const alumno = await prisma.alumno.findUnique({
    where: { id: Number(id) }
  });

  return alumno;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const alumno = await getAlumno(id);
    if (!alumno) {
      return NextResponse.json(
        { mensaje: "Alumno no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(alumno, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { mensaje: "Ocurrio un error al obtener el alumno" },
      { status: 500 },
    );
  }
}

const alumnoSchema = z.object({
  nombre: z.string()
    .trim()
    .nonempty('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre debe tener como máximo 50 caracteres'),

  apellido: z.string('El apellido debe ser un string')
    .trim()
    .nonempty('El apellido es obligatorio'),

  email: z.email('Debe ingresar un email valido'),

  telefono: z.string().optional()
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const alumno = await getAlumno(id);
    if (!alumno) {
      return NextResponse.json(
        { mensaje: "Alumno no encontrado" },
        { status: 404 },
      );
    }
    // actualizar los datos
    const body = await request.json();

    const result = alumnoSchema.safeParse(body);

    if (!result.success) {
      const errors: Record<string, string> = {};
      // const errors = z.treeifyError(result.error)
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });

      return NextResponse.json(errors, { status: 400 });
    }

    const alumnoActualizado = await prisma.alumno.update({
        where: {id: Number(id)},
        data: result.data
    });
    
    return NextResponse.json(alumnoActualizado, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { mensaje: "Ocurrio un error al obtener el alumno" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const alumno = await getAlumno(id);
    if (!alumno) {
      return NextResponse.json(
        { mensaje: "Alumno no encontrado" },
        { status: 404 },
      );
    }

    const alumnoEliminado = await prisma.alumno.delete({
      where: { id: Number(id) },
    });


    return NextResponse.json(alumnoEliminado, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { mensaje: "Ocurrio un error al obtener el alumno" },
      { status: 500 },
    );
  }
}
