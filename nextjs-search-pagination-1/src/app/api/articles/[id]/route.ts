import { NextRequest, NextResponse } from 'next/server'
import { articleStore } from '@/lib/data'
import { updateArticleSchema } from '@/lib/validation'
import { handleApiError, createApiError, ErrorCodes } from '@/lib/errors'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id:string }> }){
  try{
    const { id } = await params
    const article = articleStore.findById(id)
    if(!article){ throw createApiError(404, ErrorCodes.NOT_FOUND, 'Article non trouvé') }
    return NextResponse.json({ success:true, data:article })
  }catch(error){
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id:string }> }){
  try{
    const { id } = await params
    const body = await request.json()
    const validationResult = updateArticleSchema.safeParse(body)
    if(!validationResult.success){ throw validationResult.error }

    const article = articleStore.update(id, validationResult.data)
    if(!article){ throw createApiError(404, ErrorCodes.NOT_FOUND, 'Article non trouvé') }

    return NextResponse.json({ success:true, data:article, message:'Article mis à jour avec succès' })
  }catch(error){
    return handleApiError(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id:string }> }){
  try{
    const { id } = await params
    const deleted = articleStore.delete(id)
    if(!deleted){ throw createApiError(404, ErrorCodes.NOT_FOUND, 'Article non trouvé') }
    return NextResponse.json({ success:true, message:'Article supprimé avec succès' })
  }catch(error){
    return handleApiError(error)
  }
}
