import { z } from 'zod'

export const createArticleSchema = z.object({
  title: z.string().trim().min(1, 'Le titre est requis').max(255, 'Le titre ne peut pas dépasser 255 caractères'),
  content: z.string().min(10, 'Le contenu doit faire au moins 10 caractères').max(50000, 'Le contenu ne peut pas dépasser 50000 caractères'),
  excerpt: z.string().max(500, 'L\'extrait ne peut pas dépasser 500 caractères').optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string().trim().min(1)).max(10, 'Maximum 10 tags autorisés').default([])
})

export const updateArticleSchema = createArticleSchema.partial()

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
})

export const searchSchema = z.object({
  q: z.string().optional(),
  published: z.coerce.boolean().optional(),
  tags: z.string()
    .transform(str => (str?.trim()?.length ? str.split(',').map(t => t.trim()).filter(Boolean) : []))
    .optional(),
})

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type SearchInput = z.infer<typeof searchSchema>


