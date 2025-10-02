import { NextRequest, NextResponse } from 'next/server'
import { articleStore } from '@/lib/data'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest){
  try{
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if(!query || query.trim().length < 2){
      return NextResponse.json({ success:true, data:[], message:'Requête trop courte (minimum 2 caractères)' })
    }

    const results = articleStore.findAll({ search: query.trim(), published: true })
    const limitedResults = results.slice(0, 10)
    const stats = { total: results.length, returned: limitedResults.length, query: query.trim() }

    return NextResponse.json({ success:true, data:limitedResults, stats })
  }catch(error){
    return handleApiError(error)
  }
}
