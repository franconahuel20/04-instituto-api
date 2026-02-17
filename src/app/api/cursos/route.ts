import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import z from 'zod'

/* =========================
   GET /api/cursos
========================= */
export async function GET(request: Request) {
  try {
    const cursos = await prisma.curso.findMany({
      include: {
        profesor: true,
        alumnos: true
      }
    })

    return NextResponse.json(cursos, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { mensaje: 'Ocurrió un error al listar los cursos' },
      { status: 500 }
    )
  }
}

/* =========================
   Zod schema
========================= */
const cursoSchema = z.object({
  nombre: z.string()
    .trim()
    .nonempty('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre debe tener como máximo 100 caracteres'),

  profesorId: z.number().int().positive().optional()
})

/* =========================
   POST /api/cursos
========================= */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = cursoSchema.safeParse(body)

    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string
        errors[field] = issue.message
      })
      return NextResponse.json(errors, { status: 400 })
    }

    const cursoNuevo = await prisma.curso.create({
      data: {
        nombre: body.nombre,
        profesorId: body.profesorId ?? null
      }
    })

    return NextResponse.json(cursoNuevo, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { mensaje: 'Ocurrió un error al crear el curso' },
      { status: 500 }
    )
  }
}