import prisma from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'
import z from "zod";

export async function GET(request: Request) {
  try {
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { mensaje: 'Ocurrio un error al listar los alumnos' },
      { status: 500 }
    )
  }

  const alumnos = await prisma.alumno.findMany()
  return NextResponse.json(alumnos, { status: 200 })
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = alumnoSchema.safeParse(body)
    if (!result.success) {
  //const errors = z.treeifyError(result.error)
    const errors: Record<string, string> = {}
    result.error.issues.forEach(issue => {
    const field = issue.path[0] as string
    errors[field] = issue.message
    })
  return NextResponse.json(errors, { status: 400 })
    }
    const alumnoNuevo = await prisma.alumno.create({
    data: body
    })
    return NextResponse.json(alumnoNuevo, {status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { mensaje: 'Ocurrio un error al crear un alumno' },
      { status: 500 }
    )
  }
}
