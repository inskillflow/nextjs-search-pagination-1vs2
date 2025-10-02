// But des multiples DTO : 
// (1) Séparer l’entité DB de ce que le client envoie/reçoit, 
// (2) sécuriser/valider la surface d’API, 
// (3) spécialiser par usage (create, update, filtrage).

// Entité persistée (forme complète côté DB/serveur, non exposée telle quelle au client).
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

// DTO d’entrée pour création (seuls les champs autorisés à être fournis par le client).
export interface CreateArticleDto {
  title: string
  content: string
  excerpt?: string
  published?: boolean
  tags?: string[]
}

// DTO d’entrée pour mise à jour partielle (tous les champs de Create sont optionnels).
export type UpdateArticleDto = Partial<CreateArticleDto>

// DTO pour requêtes/listing (filtrer/rechercher sans exposer l’entité).
export interface ArticleFilters {
  published?: boolean
  tags?: string[]
  search?: string
}
