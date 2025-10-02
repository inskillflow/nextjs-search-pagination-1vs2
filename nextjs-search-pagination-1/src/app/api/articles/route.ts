import { NextRequest, NextResponse } from 'next/server'
import { articleStore } from '@/lib/data'
import { createArticleSchema, paginationSchema, searchSchema } from '@/lib/validation'
import { handleApiError, createApiError, ErrorCodes } from '@/lib/errors'

export async function GET(request: NextRequest){
  try{
    const { searchParams } = new URL(request.url)

    const paginationResult = paginationSchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit')
    })
    if(!paginationResult.success){
      throw createApiError(400, ErrorCodes.VALIDATION_ERROR, 'Paramètres de pagination invalides', paginationResult.error.errors)
    }

    const searchResult = searchSchema.safeParse({
      q: searchParams.get('q'),
      published: searchParams.get('published'),
      tags: searchParams.get('tags')
    })
    if(!searchResult.success){
      throw createApiError(400, ErrorCodes.VALIDATION_ERROR, 'Paramètres de recherche invalides', searchResult.error.errors)
    }

    const { page, limit } = paginationResult.data
    const { q: search, published, tags } = searchResult.data

    const result = articleStore.paginate(page, limit, {
      search,
      published,
      tags: tags && tags.length ? tags : undefined
    })

    return NextResponse.json({ success:true, data:result.articles, pagination:result.pagination })
  }catch(error){
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest){
  try{
    const body = await request.json()
    const validationResult = createArticleSchema.safeParse(body)
    if(!validationResult.success){ throw validationResult.error }

    const article = articleStore.create(validationResult.data)
    return NextResponse.json({ success:true, data:article, message:'Article créé avec succès' }, { status:201 })
  }catch(error){
    return handleApiError(error)
  }
}
