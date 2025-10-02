export interface Article {
  id: string
  title: string
  content: string
  excerpt?: string
  published: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateArticleDto {
  title: string
  content: string
  excerpt?: string
  published?: boolean
  tags?: string[]
}

export type UpdateArticleDto = Partial<CreateArticleDto>

export interface ArticleFilters {
  published?: boolean
  tags?: string[]
  search?: string
}
