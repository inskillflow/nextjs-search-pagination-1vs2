import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ){
    super(message)
    this.name = 'ApiError'
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN'
} as const

export function handleApiError(error: unknown){
  console.error('API Error:', error)

  if(error instanceof ZodError){
    return NextResponse.json({
      success:false,
      error:ErrorCodes.VALIDATION_ERROR,
      message:'Données invalides',
      details:error.errors?.map(err => ({ path: err.path.join('.'), message: err.message })) || []
    }, { status:400 })
  }

  if(error instanceof ApiError){
    return NextResponse.json({
      success:false,
      error:error.code,
      message:error.message,
      details:error.details
    }, { status:error.statusCode })
  }

  return NextResponse.json({
    success:false,
    error:ErrorCodes.INTERNAL_ERROR,
    message:'Une erreur interne est survenue'
  }, { status:500 })
}

export function createApiError(
  statusCode:number, code:string, message:string, details?:unknown
){
  return new ApiError(statusCode, code, message, details)
}
