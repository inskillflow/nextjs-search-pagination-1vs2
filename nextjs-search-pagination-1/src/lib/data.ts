import { Article, ArticleFilters, CreateArticleDto } from '@/types/article'
import { generateId } from './utils'

type CreateInternal = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>

class ArticleStore{
  private articles: Article[] = []

  constructor(){ this.seedData() }

  private seedData(){
    const sampleArticles: CreateInternal[] = [
      { title:'Introduction à Next.js 15', content:'Next.js 15 apporte de nombreuses améliorations...', excerpt:'Découvrez les nouveautés de Next.js 15', published:true, tags:['nextjs','react','javascript'] },
      { title:'TypeScript pour les débutants', content:'TypeScript est un sur-ensemble de JavaScript...', excerpt:'Apprenez les bases de TypeScript', published:true, tags:['typescript','javascript'] },
      { title:"Brouillon d'article", content:'Ceci est un brouillon...', published:false, tags:['draft'] },
    ]
    sampleArticles.forEach(d => this.create(d))
  }

  create(data: CreateInternal | CreateArticleDto): Article{
    const now = new Date()
    const article: Article = {
      id: generateId(),
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      published: data.published ?? false,
      tags: data.tags ?? [],
      createdAt: now,
      updatedAt: now
    }
    this.articles.push(article)
    return article
  }

  findAll(filters?: ArticleFilters): Article[]{
    let filtered = [...this.articles]

    if(filters?.published !== undefined){
      filtered = filtered.filter(a => a.published === filters.published)
    }
    if(filters?.tags?.length){
      filtered = filtered.filter(a => filters.tags!.some(t => a.tags.includes(t)))
    }
    if(filters?.search){
      const q = filters.search.toLowerCase()
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q))
      )
    }
    return filtered.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  findById(id:string){ return this.articles.find(a => a.id === id) }

  update(id:string, data: Partial<Article>): Article | null{
    const index = this.articles.findIndex(a => a.id === id)
    if(index === -1) return null
    const updated: Article = { ...this.articles[index], ...data, createdAt:new Date(this.articles[index].createdAt), updatedAt:new Date() }
    this.articles[index] = updated
    return updated
  }

  delete(id:string): boolean{
    const index = this.articles.findIndex(a => a.id === id)
    if(index === -1) return false
    this.articles.splice(index,1)
    return true
  }

  count(filters?: ArticleFilters){ return this.findAll(filters).length }

  paginate(page:number, limit:number, filters?: ArticleFilters){
    const all = this.findAll(filters)
    const total = all.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const safePage = Math.min(Math.max(1, page), totalPages)
    const offset = (safePage - 1) * limit
    const articles = all.slice(offset, offset + limit)
    return { articles, pagination:{ page:safePage, limit, total, totalPages } }
  }
}

export const articleStore = new ArticleStore()
